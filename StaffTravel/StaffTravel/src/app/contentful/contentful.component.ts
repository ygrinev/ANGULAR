import { Component } from '@angular/core';
import { ContentfulService } from './src/services/contentful.service';


@Component({
    selector: 'swcontentful',
    styleUrls: ['./contentful.component.scss'],
    template: `
    <header>
    <nav>
      <h1>NG2 Contentful demo</h1>
      <ul>
        <li>
          <a [routerLink]=" [''] ">Assets</a>
        </li>
        <li>
          <a [routerLink]=" ['/content-types'] ">Content types</a>
        </li>
      </ul>
    </nav>
    </header>
    <router-outlet></router-outlet>
  `
})
export class ContentfulComponent {
    public contentfulService: ContentfulService;

    constructor(contentfulService: ContentfulService) {
        this.contentfulService = contentfulService;
    }
}