<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 flex justify-center items-start overflow-hidden"
    @click.self="close"
  >
    <div v-if="isVisible" class="bg-gray-600 p-6 rounded-lg text-center mt-20">
      <h2 class="text-xl font-bold">Error!</h2>
      <p class="mt-2">{{ props.message }}</p>
      <button @click="close" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 animate-pulse">
        Закрыть
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped></style>
