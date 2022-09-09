import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root",
})

//this service is meant to resolve platform issues arising from difference in structure between the old and the new platform
export class OldPlatformNegotiatorService {
  constructor(private store: LocalStoreService) {}

  getLoggedInUserProfile() {
    let profile: any = JSON.parse(localStorage["user"]);
    return profile;
  }

  //get user full name. If param is not supplied; then use currently logged in user.
  getUserFullName(user = null) {
    let profile = user ? user : this.getLoggedInUserProfile();

    if (!profile) return null;

    let name = `${profile.first_name} ${profile.other_names} ${profile.surname}`;

    var user_title = profile.title ? profile.title : profile.title_string;

    if(!user_title) user_title = ' ';

    if (!isNaN(user_title)) {
      user_title = "";
    }
    let full_name = user_title + " " + name;
    return full_name.replace("null", "");
  }
}
