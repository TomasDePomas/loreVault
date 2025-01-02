<template>
  <q-card style="max-height: 60vh; overflow-y: auto">
    <q-card-section v-if="editableContent === null">
      <div class="text-h6 q-mb-md">
        <q-btn class="float-right" icon="edit" @click="startEdit" />
        {{ record.identifier }}
      </div>
      <div v-for="category in Object.keys(record.categories)" :key="category">
        <q-chip color="accent">{{ category }}</q-chip>
        <q-chip
          v-for="({ value }, index) in record.categories[category]"
          :key="index"
          >{{ value }}</q-chip
        >
      </div>
      <div class="record-content" v-html="record.content" />
    </q-card-section>
    <q-card-section v-else>
      <div class="text-h6 q-mb-md">
        <q-btn class="float-right" icon="close" @click="cancelEdit" />
        <q-input v-model="editableIdentifier" class="text-h6" />
      </div>
      <strong>{{ 'Tags and categories' }}</strong>
      <q-list>
        <q-item v-for="(category, index) in editableCategories" :key="index">
          <q-item-section style="max-width: 25%">
            <q-select
              ref="categorySelectRefs"
              v-model="category.name"
              clearable
              filled
              :hide-dropdown-icon="availableCategories.length === 0"
              new-value-mode="add-unique"
              :options="availableCategories"
              use-input
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="category.values"
              filled
              multiple
              new-value-mode="add-unique"
              option-label="value"
              :options="availableCategoryValues[category.name]"
              stack-label
              use-chips
              use-input
            />
          </q-item-section>
          <q-item-section side>
            <q-btn icon="close" round @click="removeCategory(index)" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="addCategory()">
          <q-item-section avatar>
            <q-avatar icon="add" />
          </q-item-section>
        </q-item>
      </q-list>
      <strong>{{ 'Content' }}</strong>
      <q-editor
        ref="editorRef"
        v-model="editableContent"
        class="record-content"
        :definitions="{
          uploadImage: {
            tip: 'Add image',
            icon: 'image',
            label: 'Image',
            handler: uploadImage,
          },
          cancel: {
            tip: 'Cancel editing',
            icon: 'close',
            label: 'Cancel',
            handler: cancelEdit,
            disable: !record.identifier,
          },
          save: {
            tip: 'Save your work',
            icon: 'save',
            label: 'Save',
            handler: saveEdit,
          },
        }"
        min-height="5rem"
        :toolbar="[
          [
            {
              label: 'Formatting',
              icon: 'title',
              list: 'no-icons',
              options: ['p', 'h2'],
            },
          ],
          ['bold', 'italic', 'strike', 'uploadImage'],
          ['undo', 'redo', 'save', 'cancel'],
        ]"
        @paste="blockPaste"
      />
    </q-card-section>
  </q-card>
  <q-page-sticky :offset="[18, 18]" position="bottom-right">
    <q-btn
      v-if="editableContent !== null"
      color="accent"
      fab
      icon="save"
      @click="saveEdit"
    />
    <template v-else>
      <q-btn fab icon="close" size="sm" @click="record = null" />
      <q-btn color="accent" fab icon="edit" @click="startEdit" />
    </template>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, toRaw, watch } from 'vue'
import { LoreRecord } from 'src/types/LoreRecord'
import { QEditor, QSelect } from 'quasar'
import { Optional } from 'src/types/Optional'
import { LoreRecordCategory } from 'src/types/LoreRecordCategory'
import Ledger from 'src/classes/Ledger'
import VaultTeller from 'src/classes/VaultTeller'
import Clerk from 'src/classes/Clerk'
import { useDialog } from 'src/mixins/useDialog'

const record = defineModel<
  Optional<LoreRecord, 'identifier'> & { content: string }
>('record', { required: true })

const { showPrompt } = useDialog()
const editableIdentifier = ref<string | undefined>(undefined)
const editableContent = ref<string | null>(null)
const availableCategoryValues = ref<Record<string, string[]>>({})
const editableCategories = ref<
  { name: string; values: LoreRecordCategory[] }[] | null
>(null)
const editorRef = ref<typeof QEditor>()
const categorySelectRefs = ref<(typeof QSelect)[]>()

const availableCategories = computed<string[]>(() => {
  return Object.keys(availableCategoryValues.value).filter((category) => {
    return editableCategories.value?.every(({ name }) => name !== category)
  })
})

const startEdit = (): void => {
  editableContent.value = record.value.content
  editableIdentifier.value = record.value.identifier
  editableCategories.value = []

  for (const categoryName of Object.keys(record.value.categories)) {
    editableCategories.value.push({
      name: categoryName,
      values: record.value.categories[categoryName],
    })
  }

  Ledger.getCategories().then((categoryValues) => {
    availableCategoryValues.value = categoryValues
  })
}
const addCategory = async (): Promise<void> => {
  if (editableCategories.value === null) {
    return
  }
  editableCategories.value.push({
    name: `Category ${editableCategories.value.length + 1}`,
    values: [],
  })
  await nextTick()
  if (!categorySelectRefs.value) {
    return
  }
  const lastSelect =
    categorySelectRefs.value[categorySelectRefs.value.length - 1]
  if (!lastSelect) {
    return
  }
  lastSelect.focus()
}
const removeCategory = (index: number): void => {
  if (editableCategories.value === null) {
    return
  }
  editableCategories.value.splice(index, 1)
}

const uploadImage = async (): Promise<void> => {
  const image = await Clerk.openImage()
  if (!image) {
    return
  }
  const title = await showPrompt('What is in this image?')
  if (!title) {
    return
  }
  editableContent.value += `<img src="${image.content}" title="${title}" alt="${image.filename}"/>`
}
const cancelEdit = (): void => {
  editableContent.value = null
  editableCategories.value = null
}
const saveEdit = (): void => {
  if (
    !editableIdentifier.value ||
    !editableContent.value ||
    !editableCategories.value
  ) {
    return
  }

  const recordData: LoreRecord = {
    identifier: editableIdentifier.value,
    categories: editableCategories.value.reduce(
      (categories, category) => ({
        ...categories,
        [category.name]: category.values.map((category) => ({
          value: toRaw(category),
        })),
      }),
      {},
    ),
  }
  if (record.value.identifier) {
    VaultTeller.updateRecord(
      record.value.identifier,
      recordData,
      editableContent.value,
    )
  } else {
    VaultTeller.addRecord(recordData, editableContent.value)
  }
  record.value.identifier = editableIdentifier.value
  record.value.content = editableContent.value
  editableContent.value = null
  editableIdentifier.value = undefined
  editableCategories.value = null
}
const blockPaste = (event: any): void => {
  if (!editorRef.value || event.target.nodeName === 'INPUT') {
    return
  }
  let text
  event.preventDefault()
  event.stopPropagation()
  if ('originalEvent' in event && event.originalEvent.clipboardData.getData) {
    text = event.originalEvent.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  } else if (event.clipboardData && event.clipboardData.getData) {
    text = event.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  }
}

watch(
  () => record.value.identifier,
  (id) => {
    if (!id) {
      startEdit()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss">
.record-content {
  h2 {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.375rem;
  }
  img {
    display: block;
  }
}
</style>
