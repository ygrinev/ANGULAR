import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mods-home',
  templateUrl: './mods-home.component.html',
  styleUrls: ['./mods-home.component.css']
})
export class ModsHomeComponent implements OnInit {

  modalOpen = false;

  items = [
    {title: 'Why is the sky blue?', content: 'The title is blue because of it is.'},
    {title: 'What does an orange taste like?', content: 'An orange tastes like an orange.'},
    {title: 'What color is that cat?', content: 'The cat is orange.'}
  ];
  
  constructor() { }

  ngOnInit() {  }

  onClick(){
    this.modalOpen = !this.modalOpen;
  }

}
