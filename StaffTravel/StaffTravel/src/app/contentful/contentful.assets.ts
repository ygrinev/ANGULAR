import { Component, OnInit } from '@angular/core';
import { ContentfulService } from './src/services/contentful.service';
import { Router } from '@angular/router';


@Component({
    template: `
    <h2>Assets</h2>
    <div class="error" *ngIf="error">
      {{ error }}
    </div>
    <div>
      <ul>
        <li *ngFor="let asset of assets">
          <a *ngIf="asset?.fields?.file?.url" href="{{ asset.fields.file.url }}">
            {{ asset.fields.title }}
          </a>
        </li>
      </ul>
    </div>
  `
})
export class ContentfulAssets implements OnInit {
    public assets: any[];

    public error: string;

    private contentfulService: ContentfulService;
    private router: Router;

    public constructor(contentfulService: ContentfulService, router: Router) {
        this.contentfulService = contentfulService;
        this.router = router;
    }

    public ngOnInit(): void {
        if (this.contentfulService.isServiceConfigured()) {
            this.contentfulService
                .create()
                .getAssets()
                .commit()
                .subscribe((value) => {
                    this.assets = value.items;
                });
        } else {
            this.router.navigateByUrl('');
        }
    }
}