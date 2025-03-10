<template>
  <main class="max-w-[600px] max-h-[600px] mx-auto flex flex-col">
    <!-- Header -->
    <div class="flex font-bold text-lg">
      <div class="w-1/15 mr-1.5 text-center">ID</div>
      <div class="w-1/15 text-center">AID</div>
      <div class="w-1/2"><p @click="test($event)" class="cursor-pointer w-fit mx-auto">Title</p></div>
      <div class="w-1/2 text-center">URL</div>
      <div class="w-1/2 text-center">Thumbnail URL</div>
    </div>

    <loader class="mx-auto top-15" v-if="albumStore.isLoading" />

    <!-- Data -->
    <div ref="scrollContainer" @scroll="handleScroll" class="overflow-y-auto scrollbar-thin flex flex-col gap-3">
      <div
        v-for="album in albums"
        :key="album.id"
        class="rounded-lg bg-gray-300/15 p-1 cursor-pointer transition duration-150 ease-in-out hover:shadow-lg shadow-black hover:bg-white/40"
      >
        <!-- Short version -->
        <div v-if="openAlbumId !== album.id" class="flex gap-x-2" @click="toggleAlbum(album.id)">
          <div class="w-1/15 mr-1.5">{{ album.id }}</div>
          <div class="w-1/15">{{ album.albumId }}</div>
          <div class="w-1/2 truncate" :title="album.title">{{ album.title }}</div>
          <div class="w-1/2 truncate" :title="album.url">{{ album.url }}</div>
          <div class="w-1/2 truncate" :title="album.thumbnailUrl">{{ album.thumbnailUrl }}</div>
        </div>

        <!-- Full version -->
        <div v-else @click="toggleAlbum(album.id)" class="bg-gray-300/15 rounded-lg flex flex-col justify-center">
          <div class="flex justify-around">
            <div>
              <strong>ID: </strong>
              <p class="inline">{{ album.id }}</p>
            </div>
            <div>
              <strong>Album ID: </strong>
              <p class="inline">{{ album.albumId }}</p>
            </div>
          </div>
          <div class="text-center"><strong>Title: </strong>{{ album.title }}</div>
          <div class="text-center">
            <strong>URL: </strong>
            <a
              :href="album.url"
              class="underline hover:text-blue-700 transition duration-150 ease-in-out"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ album.url }}
            </a>
          </div>
          <div class="text-center">
            <strong>Thumbnail URL: </strong>
            <a
              :href="album.thumbnailUrl"
              class="underline hover:text-blue-700 transition duration-150 ease-in-out"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ album.thumbnailUrl }}
            </a>
          </div>
        </div>
      </div>

      <!-- Intersection Observer -->
      <div ref="observerTarget" class="h-1"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import loader from "../ui/loader.vue";
import { onMounted, ref, onUnmounted } from "vue";
import { useAlbumStore } from "./../store/store";
import { storeToRefs } from "pinia";

// const tableHeader: string[] = ["ID", "Album ID", "Title", "URL", "Thumbnail URL"];

const scrollContainer = ref<HTMLElement | null>(null);

const albumStore = useAlbumStore();
const { albums } = storeToRefs(albumStore);
const openAlbumId = ref<number | null>(null);

const toggleAlbum = (id: number) => {
  openAlbumId.value = openAlbumId.value === id ? null : id;
};

onMounted(() => {
  albumStore.initAlbums(30);
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
});

// dynamic upload albums
const handleScroll = () => {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

    if (!albumStore.isSearch && !albumStore.isAdding && scrollPercentage >= 90) {
      albumStore.addAlbums(20);
    }
  }
};

const test = (event: Event) => {
	const target = event.target as HTMLElement;
  console.log("Clicked element:", target);

	target.classList.toggle("bg-white")
}
</script>

<style scoped></style>
