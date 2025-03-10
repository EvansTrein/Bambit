import { defineStore } from "pinia";
import { ApiService, type Album } from "./../services/api";
import { ref } from "vue";

export const useAlbumStore = defineStore("album", {
  state: () => ({
    albums: [] as Album[],
    apiService: new ApiService(),
    isLoading: ref<boolean>(false),
    isSearch: ref<boolean>(false),
    isAdding: ref<boolean>(false),
  }),
  actions: {
    async initAlbums(limit: number) {
      try {
        this.isLoading = true;

        const newAlbums = await this.apiService.initPhotos(limit);
        this.albums = newAlbums;

        this.isLoading = false;
        saveIDtoLocalStorage(this.albums);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async searchAlbumsByIds(ids: number[]) {
      try {
        this.isLoading = true;
        this.albums = [];

        const searchResults = await this.apiService.getPhotosByIds(ids);
        this.albums = searchResults;

        this.isLoading = false;
        this.isSearch = true;
        saveIDtoLocalStorage(this.albums);
      } catch (error) {
        console.error("Failed to search albums:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addAlbums(limit: number) {
      try {
        this.isAdding = true;

        const newAlbums = await this.apiService.dynamicUpload(limit);
        this.albums.push(...newAlbums);

        saveIDtoLocalStorage(this.albums);
        this.isAdding = false;
      } catch (error) {
        console.error("Failed to added albums:", error);
      } finally {
        this.isAdding = false;
      }
    },

    clearAlbums() {
      this.isSearch = false;
      this.albums = [];
    },
  },
});

function saveIDtoLocalStorage(arr: Album[]) {
  localStorage.clear;
  const albumIds = Array.from(new Set(arr.map((album) => album.albumId)));
  const albumIdsString = JSON.stringify(albumIds);
  localStorage.setItem("albumIDs", albumIdsString);
}
