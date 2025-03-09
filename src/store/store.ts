import { defineStore } from "pinia";
import { ApiService, type Album } from "./../services/api";

export const useAlbumStore = defineStore("album", {
  state: () => ({
    albums: [] as Album[],
    apiService: new ApiService(),
  }),
  actions: {
    async fetchAlbums(limit: number) {
      try {
        const newAlbums = await this.apiService.getPhotos(limit);
				this.albums.push(...newAlbums);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    },

		async searchAlbumsByIds(ids: number[]) {
      try {
        this.albums = [];
        const searchResults = await this.apiService.getPhotosByIds(ids);
        this.albums = searchResults; 
      } catch (error) {
        console.error("Failed to search albums:", error);
      }
    },

		clearAlbums() {
      this.albums = [];
    },
  },
});

