import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {


  @Input() numberOfPages: number;
  currentPage: number = 1;
  pageOptions: number[];

  constructor() { 
    this.pageOptions = [
      this.currentPage - 2,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.currentPage + 2
    ].filter(pn => pn >= 1 && pn <= this.numberOfPages);
  }

  ngOnInit(): void {
  }

}
