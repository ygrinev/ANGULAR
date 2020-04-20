import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { ResourcesService } from "../services/resources/resources.service";
import initSearchBox from "./js/wrapper";

@Component({
  selector: "search-box",
  templateUrl: "./search-box.component.html",
  styleUrls: ["./search-box.component.scss"]
})
export class SearchBoxComponent implements OnInit, AfterViewInit, OnDestroy {
    public r: any = {};
    public lang: string;
    private _routerSubscription: any;

    constructor(private route: ActivatedRoute, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => (this.r = res));
        this.lang = resourcesService.getLanguage();
    }

    ngOnInit() {
        initSearchBox();
    }

    ngAfterViewInit() {
        this._routerSubscription = this.route.fragment.subscribe(fragment => {
            if (fragment) {
                const scrollAnchorEl = document.getElementById(fragment);
                if (scrollAnchorEl) {
                    setTimeout(() => {
                        scrollAnchorEl.scrollIntoView();
                    }, 100);
                }
            }
        });
    }

    ngOnDestroy() {
        this._routerSubscription.unsubscribe();
    }
}
