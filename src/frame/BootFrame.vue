<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn dense flat icon="menu" round @click="toggleLeftDrawer" />
        <q-toolbar-title>LoreVault</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered show-if-above side="left">
      <q-list>
        <q-item clickable @click="newChest">
          <q-item-section>newChest</q-item-section>
        </q-item>
        <q-item clickable @click="openChest">
          <q-item-section>openChest</q-item-section>
        </q-item>
        <q-item clickable @click="storeChest">
          <q-item-section>storeChest</q-item-section>
        </q-item>
        <q-item clickable @click="closeChest">
          <q-item-section>closeChest</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-page>
        <q-input
          v-model="searchTerm"
          class="q-ma-md"
          clearable
          label="Search item"
          outlined
          rounded
          type="text"
          @update:model-value="searchLedger"
        />
        <q-list v-if="searchTerm">
          <q-item v-if="foundRecords.length === 0"> No items found </q-item>
          <q-item
            v-for="record in foundRecords"
            :key="record.identifier"
            clickable
            @click="openRecord(record)"
          >
            {{ record.identifier }}
          </q-item>
        </q-list>
        <OpenRecord
          v-if="openedRecord"
          v-model:record="openedRecord"
          @close="openedRecord = null"
        />
        <q-page-sticky v-else :offset="[18, 18]" position="bottom-right">
          <q-btn color="accent" fab icon="add" @click="startNewRecord" />
        </q-page-sticky>
        <q-inner-loading :showing="!chestOpened" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VaultTeller from 'src/classes/VaultTeller'
import Ledger from 'src/classes/Ledger'
import { LoreRecord } from 'src/types/LoreRecord'
import { useDialog } from 'src/mixins/useDialog'
import OpenRecord from 'src/frame/OpenRecord.vue'
const { showToast } = useDialog()

const leftDrawerOpen = ref<boolean>(false)
const chestOpened = ref<boolean>(false)
const searchTerm = ref<string>('')
const openedRecord = ref<(LoreRecord & { content: string }) | null>(null)
const foundRecords = ref<LoreRecord[]>([])
const newChest = async (): Promise<void> => {
  await Ledger.clear()
  await VaultTeller.newChest()
  await VaultTeller.fillLedger()
  leftDrawerOpen.value = false
  openedRecord.value = null
  chestOpened.value = true
}

const openChest = async (): Promise<void> => {
  await Ledger.clear()
  await VaultTeller.openChest()
  await VaultTeller.fillLedger()
  leftDrawerOpen.value = false
  openedRecord.value = null
  chestOpened.value = true
}

const searchLedger = async (
  searchTerm: string | number | null,
): Promise<void> => {
  if (typeof searchTerm !== 'string') {
    foundRecords.value = []
    return
  }
  foundRecords.value = await Ledger.findRecords(searchTerm)
}
const openRecord = async (record: LoreRecord): Promise<void> => {
  searchTerm.value = ''
  try {
    const content = await VaultTeller.getRecordContents(record.identifier)
    openedRecord.value = {
      ...record,
      content,
    }
  } catch (e) {
    console.error(e)
    await showToast({ message: 'Unable to read record' })
  }
}
const storeChest = async (): Promise<void> => {
  await VaultTeller.storeChest()
}
const closeChest = async (): Promise<void> => {
  await VaultTeller.closeChest()
  await Ledger.clear()
  chestOpened.value = false
  openedRecord.value = null
}
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const startNewRecord = (): void => {
  searchTerm.value = ''
  openedRecord.value = {
    identifier: '',
    categories: {},
    content: '',
  }
}

onMounted(async (): Promise<void> => {
  chestOpened.value = await VaultTeller.hasOpenChest()
})
</script>

<style lang="scss"></style>
