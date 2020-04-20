import { Component, OnInit } from "@angular/core";
import { Router, RouterLinkActive } from "@angular/router";
import { ResourcesService } from "../services/resources/resources.service";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.scss"],
  inputs: ["userInfo"]
})
export class NavMenuComponent implements OnInit {
  public userInfo;
  r: any = {};

  constructor(
    private router: Router,
    private resourcesService: ResourcesService
  ) {
    resourcesService.getResources().subscribe(res => (this.r = res));
  }

  ngOnInit() {}
}
