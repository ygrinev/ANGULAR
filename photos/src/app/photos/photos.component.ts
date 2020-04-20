import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  photoUrl: string;
  query: string;
  capture: string;

  constructor(private photosService: PhotosService) {
    this.fetchPhoto();
   }

  ngOnInit() {
  }

  onClick(){
    this.fetchPhoto();
  }

  private fetchPhoto(){
    this.photosService.getPhoto(this.query).subscribe(
      resp => {this.photoUrl = resp.urls.regular; this.capture = (resp.alt_description ? resp.alt_description : (this.query ? this.query : 'random'));});
  }

}
