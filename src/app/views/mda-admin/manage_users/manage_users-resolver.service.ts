import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	Resolve,
	RouterStateSnapshot,
} from "@angular/router";
import { ManageUserService } from "./manage-user.service";

@Injectable({
	providedIn: "root",
})
export class ManageUserResolver implements Resolve<{}> {
	users;
	constructor(private manageUserService: ManageUserService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		this.manageUserService.manageUserService.subscribe((data) => {
			console.log({ data });
			return (this.users = data);
		});

		return this.users;
	}
}
