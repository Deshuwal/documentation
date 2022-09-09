import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { HttpService } from "./http.service";
import { Role } from "../models/role";
import { UserPortal } from "../models/portal";
import { RoleHome } from "../models/role-home";
import { NavigationService } from "./navigation.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authenticated = false;

  constructor(
    private store: LocalStoreService,
    private httpService: HttpService,
    private navService: NavigationService,
    private router: Router
  ) {}

  checkAuth() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");

      if (!!token && token !== "undefined") {
        this.httpService.doGet("auth/me").subscribe(
          (res: any) => {
            this.authenticated = res.status == "success";
            const role = parseInt(res.data.role) as Role;
            //set name to match old platform db name
            if (res.data.name && res.data.name.trim().length < 1) {
              res.data.name = res.data.first_name + " " + res.data.surname;
            } else {
              res.data.name = res.data.first_name + " " + res.data.surname;
            }
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("portal", UserPortal[role]);
            localStorage.setItem("dashbaord", RoleHome[role]);
            this.navService.setUserMenu(UserPortal[role]);
            resolve(this.authenticated);
          },
          (error) => {
            this.signout();
            resolve(false);
          }
        );
        return;
      }

      this.authenticated = false;
      reject(false);
    });
  }

  getuser() {
    return of({});
  }

  signin(credentials: any) {

    console.log("cred", credentials);
    return new Promise((resolve, reject) => {
      this.httpService.doPost("auth/login", credentials).subscribe(
        (success: any) => {
          this.authenticated = true;
          localStorage.setItem("user", JSON.stringify(success.data.user));
          resolve(success);
        },

        (error) => {
          reject(error);
          // this.httpService.displayServerValidautionErrors(error);
        }
      );
    });
  }

  signout() {
    this.authenticated = false;
    // localStorage.setItem("demo_login_status", false);
    localStorage["user"] = undefined;
    localStorage["token"] = undefined;
    localStorage.setItem("portal", undefined);
    localStorage.setItem("dashbaord", undefined);
    this.navService.setUserMenu(undefined);
    this.router.navigateByUrl("/auth/signin");
  }
}
