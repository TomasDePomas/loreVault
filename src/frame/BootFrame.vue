<template>
  <ul>
    <li>
      <button @click="openChest">{{ 'openChest' }}</button>
    </li>
    <li>
      <button @click="fillLedger">{{ 'fillLedger' }}</button>
    </li>
    <li>
      <button @click="storeChest">{{ 'storeChest' }}</button>
    </li>
    <li>
      <button @click="closeChest">{{ 'closeChest' }}</button>
    </li>
    <li>
      <button @click="clearLedger">{{ 'clearLedger' }}</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import VaultTeller from 'src/classes/VaultTeller'
import Ledger from 'src/classes/Ledger'

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

// DONE: Call teller to open chest
// TODO: Call ledger to readChestIntoRecord
// TODO: Rudimentary calls to ledger to find items
// TODO: Rudimentary call to add items to ledger
// DONE: Call teller to store chest
// DONE: Make open chest call a call to tauri to open a zip to folder
// DONE: Call teller to close chest
// TODO: Test zip opening on android
</script>
<style scoped lang="scss"></style>
