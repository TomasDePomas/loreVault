<template>
  <ul>
    <li>
      <button @click="openChest">{{ 'openChest' }}</button>
    </li>
    <li>
      <button @click="readIntoLedger">{{ 'readIntoLedger' }}</button>
    </li>
    <li>
      <button @click="storeChest">{{ 'storeChest' }}</button>
    </li>
    <li>
      <button @click="clearLedger">{{ 'clearLedger' }}</button>
    </li>
    <li>
      <button @click="closeChest">{{ 'closeChest' }}</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import VaultTeller from 'src/classes/VaultTeller'
import Ledger from 'src/classes/Ledger'

const openChest = async (): Promise<void> => {
  console.log(await VaultTeller.openChest())
}
const readIntoLedger = async (): Promise<void> => {
  await Ledger.readChestIntoRecord()
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
