<template>
  <header class="flex justify-center p-3 gap-2">
    <span class="bg-white/20 pl-2 pr-2 rounded-3xl max-w-max text-center">total: {{ count }}</span>
    <div class="flex justify-center items-center max-w-max bg-white/20 rounded-3xl gap-2 flex-grow">
      <span>search:</span>
      <input
        v-model="searchQuery"
        required
        class="w-2/4 border-b outline-none focus:border-white"
        type="text"
        placeholder="id album/s"
      />
    </div>
    <button
      @click.prevent="handleSearch"
      class="rounded-3xl max-w-max text-center pl-2 pr-2 bg-gray-500 hover:bg-(--colorIndex2) cursor-pointer transicion-color ease-in-out duration-300 transform hover:scale-105"
    >
      download
    </button>
    <button
      @click="clearSearch"
      class="rounded-3xl max-w-maxtext-center pl-2 pr-2 bg-gray-500 hover:bg-(--colorIndex2) cursor-pointer transicion-color ease-in-out duration-300 transform hover:scale-105"
    >
      clear
    </button>

    <Modal :message="modalMessage" :isVisible="isModalVisible" @close="isModalVisible = false" />
  </header>
</template>

<script setup lang="ts">
import Modal from "./../ui/modal.vue";
import { computed, ref } from "vue";
import { useAlbumStore } from "./../store/store";
import { storeToRefs } from "pinia";

const isModalVisible = ref(false);
const modalMessage = ref("");

const albumStore = useAlbumStore();
const { albums } = storeToRefs(albumStore);
const searchQuery = ref("");

const count = computed(() => albums.value.length);

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    modalMessage.value = "The input field is blank. Enter the album IDs.";
    isModalVisible.value = true;
    return;
  }

  const ids = searchQuery.value
    .split(" ")
    .map((id) => parseInt(id.trim()))
    .filter((id) => !isNaN(id));
  albumStore.searchAlbumsByIds(ids);
};

const clearSearch = () => {
  searchQuery.value = "";
  albumStore.clearAlbums();
  albumStore.initAlbums(30);
};
</script>

<style scoped></style>
