<template>
  <main class="max-w-[600px] max-h-[600px] mx-auto flex flex-col">
    <!-- Header -->
    <div class="flex font-bold text-lg pb-2">
      <div class="w-1/15">
        <p
          @click="sortered(tableHeader.id)"
          class="pl-1 pr-1 cursor-pointer w-fit mx-auto rounded-lg duration-300 hover:text-(--colorIndex2) bg-transparen"
          :class="{ 'text-(--colorIndex2) bg-white/50 hover:bg-red': tableHeader.id.activeSort }"
        >
          {{ tableHeader.id.name }}
        </p>
      </div>
      <div class="w-1/15 ml-1">
        <p
          @click="sortered(tableHeader.albumId)"
          class="pl-1 pr-1 cursor-pointer w-fit mx-auto rounded-lg duration-300 hover:text-(--colorIndex2) bg-transparen"
          :class="{ 'text-(--colorIndex2) bg-white/50 hover:bg-red': tableHeader.albumId.activeSort }"
        >
          {{ tableHeader.albumId.name }}
        </p>
      </div>
      <div class="w-1/2">
        <p
          @click="sortered(tableHeader.title)"
          class="-translate-x-2 pl-1 pr-1 cursor-pointer w-fit mx-auto rounded-lg duration-300 hover:text-(--colorIndex2) bg-transparen"
          :class="{ 'text-(--colorIndex2) bg-white/50 hover:bg-red': tableHeader.title.activeSort }"
        >
          {{ tableHeader.title.name }}
        </p>
      </div>
      <div class="w-1/2">
        <p
          @click="sortered(tableHeader.url)"
          class="-translate-x-3 pl-1 pr-1 cursor-pointer w-fit mx-auto rounded-lg duration-300 hover:text-(--colorIndex2) bg-transparen"
          :class="{ 'text-(--colorIndex2) bg-white/50 hover:bg-red': tableHeader.url.activeSort }"
        >
          {{ tableHeader.url.name }}
        </p>
      </div>
      <div class="w-1/2">
        <p
          @click="sortered(tableHeader.thumbnailUrl)"
          class="-translate-x-2 pl-1 pr-1 cursor-pointer w-fit mx-auto rounded-lg duration-300 hover:text-(--colorIndex2) bg-transparen"
          :class="{ 'text-(--colorIndex2) bg-white/50 hover:bg-red': tableHeader.thumbnailUrl.activeSort }"
        >
          {{ tableHeader.thumbnailUrl.name }}
        </p>
      </div>
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
          <div class="w-1/15 ml-1.5">{{ album.id }}</div>
          <div class="w-1/15 ml-1 mr-1">{{ album.albumId }}</div>
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
    </div>
  </main>
</template>

<script setup lang="ts">
import loader from "@/ui/loader.vue";
import { type Album } from "./../services/api";
import { sortAlbums } from "./../utils/utils";
import { onMounted, ref, onUnmounted, reactive } from "vue";
import { useAlbumStore } from "./../store/store";
import { storeToRefs } from "pinia";

const tableHeader = reactive({
  id: { name: "ID", pole: "id" as keyof Album, activeSort: false },
  albumId: { name: "AID", pole: "albumId" as keyof Album, activeSort: false },
  title: { name: "Title", pole: "title" as keyof Album, activeSort: false },
  url: { name: "URL", pole: "url" as keyof Album, activeSort: false },
  thumbnailUrl: { name: "Thumbnail URL", pole: "thumbnailUrl" as keyof Album, activeSort: false },
});

const scrollContainer = ref<HTMLElement | null>(null);

const albumStore = useAlbumStore();
const { albums } = storeToRefs(albumStore);
const openAlbumId = ref<number | null>(null);

const toggleAlbum = (id: number) => {
  openAlbumId.value = openAlbumId.value === id ? null : id;
};

const sortered = (header: { pole: keyof Album; activeSort: boolean }) => {
  // Switch the sorting state for the current header
  header.activeSort = !header.activeSort;

  // Reset the sorting state for all other headers
  Object.values(tableHeader).forEach((h) => {
    if (h !== header) {
      h.activeSort = false;
    }
  });

  if (header.activeSort) {
    // First click: sort by selected field
    // false = from greater to lesser for numbers and alphabetically (value is inverted inside sortAlbums) true for strings
    sortAlbums(albumStore.albums, header.pole, false);
  } else {
    // Second click: default sorting by “id” from smallest to largest
    sortAlbums(albumStore.albums, "id" as keyof Album, true); // true = from less to more
  }
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
</script>

<style scoped></style>
