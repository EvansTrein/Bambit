<template>
  <main class="max-w-[600px] max-h-[600px] mx-auto flex flex-col">
    <!-- Header -->
    <div class="flex font-bold text-lg">
      <div class="w-1/15 mr-1.5 text-center">ID</div>
      <div class="w-1/15 text-center">AID</div>
      <div class="w-1/2 text-center">Title</div>
      <div class="w-1/2 text-center">URL</div>
      <div class="w-1/2 text-center">Thumbnail URL</div>
    </div>

    <!-- Data -->
    <div class="overflow-y-auto scrollbar-thin flex flex-col gap-3">
      <div
        v-for="album in albums"
        :key="album.id"
        class="flex rounded-lg bg-gray-300/15 p-1 cursor-pointer transition duration-150 ease-in-out hover:shadow-lg shadow-black hover:bg-white/40"
        @click="toggleAlbum(album.id)"
      >
        <div class="w-1/15 mr-1.5">{{ album.id }}</div>
        <div class="w-1/15">{{ album.albumId }}</div>
        <div class="w-1/2 truncate" :title="album.title">{{ album.title }}</div>
        <div class="w-1/2 truncate" :title="album.url">{{ album.url }}</div>
        <div class="w-1/2 truncate" :title="album.thumbnailUrl">{{ album.thumbnailUrl }}</div>

				<!-- Active album from openAlbumId -->
				<div v-if="openAlbumId === album.id" class="bg-gray-300/15 rounded-lg">
					<div><strong>ID:</strong> {{ album.id }}</div>
					<div><strong>Album ID:</strong> {{ album.albumId }}</div>
					<div><strong>Title:</strong> {{ album.title }}</div>
					<div><strong>URL:</strong> {{ album.url }}</div>
					<div><strong>Thumbnail URL:</strong> {{ album.thumbnailUrl }}</div>
	
				</div>
      </div>

      <div ref="observerTarget" class="h-1"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAlbumStore } from "./../store/store";
import { storeToRefs } from "pinia";

// const tableHeader: string[] = ["ID", "Album ID", "Title", "URL", "Thumbnail URL"];

const albumStore = useAlbumStore();
const { albums } = storeToRefs(albumStore);

const openAlbumId = ref<number | null>(null);

const toggleAlbum = (id: number) => {
  openAlbumId.value = openAlbumId.value === id ? null : id;
};

onMounted(() => {
  albumStore.fetchAlbums(30);
});
</script>

<style scoped></style>
