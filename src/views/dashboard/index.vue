<template>
  <div>
    <h1>Vue Calendar</h1>
    <calendar @select="onDateSelect"></calendar>
    <div v-if="selectedDate">You selected {{ selectedDate }}</div>
  </div>
</template>

<script setup>
import Calendar from '@/components/Calendar/index.vue'
const selectedDate = ref(null)
const isLoading = ref(true)
const onDateSelect = date => {
  console.log('date: ', date)
  selectedDate.value = date
}
setTimeout(() => {
  isLoading.value = false
}, 2000)
</script>

<style>
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.spinner {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  transform: translate(-50%, -50%);
}
.spinner > img {
  width: 100%;
  height: 100%;
}
</style>