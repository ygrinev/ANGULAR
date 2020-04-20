import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UnsplashResponse{
  urls:{
    regular: string;
  },
  alt_description: string
}

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  accessKey = 'Rpu4WB7a1HRSlfhcyTvu7LCeaQdhbDmd3XiVkoqylaQ';
  apiUpl = 'https://api.unsplash.com/photos/random';
  constructor(private http: HttpClient) { }

  public getPhoto(query: string){
    return this.http.get<UnsplashResponse>(this.apiUpl, {
      headers: {
        Authorization: `Client-ID ${this.accessKey}`
      },
      params: {
        query: query
      }
    })
  }
}
