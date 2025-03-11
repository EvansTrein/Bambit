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
  private offset: number;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
    this.offset = 0;
  }

  async initPhotos(limit: number): Promise<Album[]> {
    this.offset = limit;
    // artificial delay for displaying the loading animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await this.axiosInstance.get<Album[]>("/photos", {
      params: {
        _limit: limit,
      },
    });
    return response.data;
  }

  async getPhotosByIds(ids: number[]): Promise<Album[]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // url query - albumId=1&albumId=2&albumId=3
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("albumId", id.toString()));

    const response = await this.axiosInstance.get<Album[]>("/photos", {
      params: params,
    });
    return response.data;
  }

  async dynamicUpload(limit: number): Promise<Album[]> {
    const response = await this.axiosInstance.get<Album[]>("/photos", {
      params: {
        _start: this.offset,
        _limit: limit,
      },
    });

    if (response.status == 200) {
      this.offset += limit;
    }

    return response.data;
  }
}
