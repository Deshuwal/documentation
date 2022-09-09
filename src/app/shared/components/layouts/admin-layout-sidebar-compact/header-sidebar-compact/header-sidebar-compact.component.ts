import { Component, OnInit } from "@angular/core";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { SearchService } from "src/app/shared/services/search.service";
import { AuthService } from "src/app/shared/services/auth.service";

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-header-sidebar-compact",
  templateUrl: "./header-sidebar-compact.component.html",
  styleUrls: ["./header-sidebar-compact.component.scss"]
})
export class HeaderSidebarCompactComponent implements OnInit {
  notifications: any[];

  scrolledToBottom:boolean = false;

  headerMenu:string = "";

  constructor(
    private navService: NavigationService,
    public searchService: SearchService,
    private auth: AuthService,
    private toastService: ToastrService


  ) {
    this.notifications = [
      {
        icon: "i-Speach-Bubble-6",
        title: "New message",
        badge: "3",
        text: "James: Hey! are you busy?",
        time: new Date(),
        status: "primary",
        link: "/chat"
      },
      {
        icon: "i-Receipt-3",
        title: "Your payment for Billing ref 11029 was marked as suspicious",
        badge: "$4036",
        text: "1 Headphone, 3 iPhone x",
        time: new Date("11/11/2018"),
        status: "success",
        link: "/tables/full"
      },
      {
        icon: "i-Empty-Box",
        title: "Upcomping PAYE on April 31st",
        text: "Headphone E67, R98, XL90, Q77",
        time: new Date("11/10/2018"),
        status: "danger",
        link: "/tables/list"
      },
      {
        icon: "i-Data-Power",
        title: "Server up!",
        text: "Server rebooted successfully",
        time: new Date("11/08/2018"),
        status: "success",
        link: "/dashboard/v2"
      },
      {
        icon: "i-Data-Block",
        title: "Server down!",
        badge: "Resolved",
        text: "Region 1: Server crashed!",
        time: new Date("11/06/2018"),
        status: "danger",
        link: "/dashboard/v3"
      }
    ];

    this.headerMenu = localStorage['portal'].toUpperCase();
  }

  ngOnInit() {}

  toggelSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = !state.sidenavOpen;
    state.childnavOpen = !state.childnavOpen;
  }

  scrollDown(){
    
    setTimeout(()=>{
      let win: any = window; 
      win.scrollTo(0, (document.body.scrollHeight));
      }, 500); 

      this.toastService.info('AutoScroll', "Page Bottom", {
        timeOut: 2000,
        closeButton: true,
        progressBar: true,
      });
 
    
  }
  signout() {
    localStorage.clear();
    this.auth.signout();
  }
}
