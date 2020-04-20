import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

  @Input() items = [];

  openedItemIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  onClick(index: number)
  {
    this.openedItemIndex = this.openedItemIndex == index ? -1 : index;
  }

}
