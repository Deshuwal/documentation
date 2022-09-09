import { Component, OnInit, HostListener } from "@angular/core";
import {
  NavigationService,
  IMenuItem,
  IChildItem,
} from "../../../../services/navigation.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter, subscribeOn } from "rxjs/operators";
import { Utils } from "../../../../utils";

@Component({
  selector: "app-sidebar-compact",
  templateUrl: "./sidebar-compact.component.html",
  styleUrls: ["./sidebar-compact.component.scss"],
})
export class SidebarCompactComponent implements OnInit {
  selectedItem: IMenuItem;

  nav: IMenuItem[];

  constructor(public router: Router, public navService: NavigationService) {}

  ngOnInit() {
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        this.closeChildNav();
        if (Utils.isMobile()) {
          this.navService.sidebarState.sidenavOpen = false;
        }
      });

    this.navService.menuItems$.subscribe((items) => {
      items.map((item) => {
        if (item.name == "Dashboard") {
          const newItem = item.sub.map((sub) => {
            return sub;
          });
          item.sub = newItem;
          return { ...items, sub: newItem };
        }
        return item;
      });
      console.log({ items });
      this.nav = items;
      this.setActiveFlag();
    });
  }

  accountComplete(): boolean {
    var userProfile: any = JSON.parse(localStorage["user"]);

    return (
      userProfile.occupation &&
      userProfile.gender &&
      userProfile.employment_status &&
      userProfile.address
    );
  }

  selectItem(item) {
    this.navService.sidebarState.childnavOpen = true;
    this.selectedItem = item;
    this.setActiveMainItem(item);
  }
  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
    this.setActiveFlag();
  }

  onClickChangeActiveFlag(item) {
    this.setActiveMainItem(item);
  }
  setActiveMainItem(item) {
    this.nav.forEach((item) => {
      item.active = false;
    });
    item.active = true;
  }

  setActiveFlag() {
    if (window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      console.log("gotten active route ", activeRoute);
      this.nav.forEach((item) => {
        item.active = false;
        console.log("checkign name ", item.name);

        console.log("checkign state ", item.state);
        if (activeRoute.indexOf(item.state) !== -1) {
          this.selectedItem = item;
          item.active = true;
        }
        if (item.sub) {
          item.sub.forEach((subItem) => {
            subItem.active = false;
            if (activeRoute.indexOf(subItem.state) !== -1) {
              this.selectedItem = item;
              item.active = true;
              console.log("checkign state-------- ", subItem.state);

              // subItem.active = true;
              // debugger;
            }
            if (subItem.sub) {
              subItem.sub.forEach((subChildItem) => {
                if (activeRoute.indexOf(subChildItem.state) !== -1) {
                  this.selectedItem = item;
                  item.active = true;
                  subItem.active = true;
                }
              });
            }
          });
        }
      });
    }
  }

  updateSidebar() {
    if (Utils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    } else {
      this.navService.sidebarState.sidenavOpen = true;
    }
  }
  toggelSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = !state.sidenavOpen;
    state.childnavOpen = !state.childnavOpen;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateSidebar();
  }
}
