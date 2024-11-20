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
        <q-item v-if="foundItems.length === 0">
          {{ 'No items found' }}
        </q-item>
        <q-item v-for="item in foundItems" :key="item.identifier">
          {{ item.identifier }}
        </q-item>
      </q-list>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VaultTeller from 'src/classes/VaultTeller'
import Ledger from 'src/classes/Ledger'
import { LoreRecord } from 'src/types/LoreRecord'

const leftDrawerOpen = ref<boolean>(false)
const searchTerm = ref<string>('')
const foundItems = ref<LoreRecord[]>([])

const openChest = async (): Promise<void> => {
  await VaultTeller.openChest()
}
const fillLedger = async (): Promise<void> => {
  await VaultTeller.fillLedger()
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

const searchLedger = async (searchTerm: string): Promise<void> => {
  foundItems.value = await Ledger.findRecords(searchTerm)
}
// DONE: Call teller to open chest
// DONE: Call ledger to readChestIntoRecord
// DONE: Rudimentary calls to ledger to find items
// TODO: Rudimentary call to open
// TODO: Rudimentary call to update items
// TODO: Rudimentary call to create items and add to ledger
// DONE: Call teller to store chest
// DONE: Make open chest call a call to tauri to open a zip to folder
// DONE: Call teller to close chest
// TODO: Tauri versies van drivers
// TODO: Test zip opening on android
</script>
<style scoped lang="scss"></style>
