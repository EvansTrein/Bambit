import axios, { type AxiosInstance } from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export interface Album {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export class ApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
  }

  async getPhotos(limit: number): Promise<Album[]> {
		// await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await this.axiosInstance.get<Album[]>("/photos", {
      params: {
        _limit: limit,
      },
    });
    return response.data;
  }

  async getPhotosByIds(ids: number[]): Promise<Album[]> {
    // url query - albumId=1&albumId=2&albumId=3
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("albumId", id.toString()));

    const response = await this.axiosInstance.get<Album[]>("/photos", {
      params: params,
    });
    return response.data;
  }
}
