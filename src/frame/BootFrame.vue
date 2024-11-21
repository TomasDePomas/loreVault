<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-btn dense flat icon="menu" round @click="toggleLeftDrawer" />
        <q-toolbar-title> {{ 'LoreVault' }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered show-if-above side="left">
      <q-list>
        <q-item clickable @click="openChest">
          <q-item-section>{{ 'openChest' }}</q-item-section>
        </q-item>
        <q-item clickable @click="fillLedger">
          <q-item-section>{{ 'fillLedger' }}</q-item-section>
        </q-item>
        <q-item clickable @click="storeChest">
          <q-item-section>{{ 'storeChest' }}</q-item-section>
        </q-item>
        <q-item clickable @click="closeChest">
          <q-item-section>{{ 'closeChest' }}</q-item-section>
        </q-item>
        <q-item clickable @click="clearLedger">
          <q-item-section>{{ 'clearLedger' }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-input
        v-model="searchTerm"
        class="q-ma-md"
        clearable
        label="Search item"
        outlined
        rounded
        @update:model-value="searchLedger"
      />
      <q-list v-if="searchTerm">
        <q-item v-if="foundRecords.length === 0">
          {{ 'No items found' }}
        </q-item>
        <q-item
          v-for="record in foundRecords"
          :key="record.identifier"
          clickable
          @click="openRecord(record)"
        >
          {{ record.identifier }}
        </q-item>
      </q-list>

      <q-card v-if="openedRecord">
        <q-card-section>
          <div class="text-h6">
            <h1>{{ openedRecord.identifier }}</h1>
          </div>
          <div
            v-for="category in Object.keys(openedRecord.categories)"
            :key="category"
          >
            <q-chip color="accent">{{ category }}</q-chip>
            <q-chip
              v-for="({ value }, index) in openedRecord.categories[category]"
              :key="index"
              >{{ value }}</q-chip
            >
          </div>
        </q-card-section>
        <q-card-section>
          <div v-html="openedRecord.content" />
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VaultTeller from 'src/classes/VaultTeller'
import Ledger from 'src/classes/Ledger'
import { LoreRecord } from 'src/types/LoreRecord'
import { useDialog } from 'src/mixins/useDialog'
const { showToast } = useDialog()

const leftDrawerOpen = ref<boolean>(false)
const searchTerm = ref<string>('')
const openedRecord = ref<(LoreRecord & { content: string }) | null>(null)
const foundRecords = ref<LoreRecord[]>([])

const openChest = async (): Promise<void> => {
  await VaultTeller.openChest()
}
const fillLedger = async (): Promise<void> => {
  await VaultTeller.fillLedger()
}

const searchLedger = async (searchTerm: string): Promise<void> => {
  foundRecords.value = await Ledger.findRecords(searchTerm)
}
const openRecord = async (record: LoreRecord): Promise<void> => {
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
}
const clearLedger = async (): Promise<void> => {
  await Ledger.clear()
}
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// DONE: Call teller to open chest
// DONE: Call ledger to readChestIntoRecord
// DONE: Rudimentary calls to ledger to find items
// DONE: Rudimentary call to open
// DONE: Replace images for base64
// TODO: Rudimentary call to update items
// TODO: Rudimentary call to create items and add to ledger
// DONE: Call teller to store chest
// DONE: Make open chest call a call to tauri to open a zip to folder
// DONE: Call teller to close chest
// TODO: Tauri versies van drivers
// TODO: Test zip opening on android
</script>
<style scoped lang="scss"></style>
