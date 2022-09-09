import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { AuditActivityService } from "./activity.service";

@Injectable({
  providedIn: "root",
})
export class AuditActivityResolver implements Resolve<{}> {
  activities;
  constructor(private activityService: AuditActivityService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.activityService.activity.subscribe(
      (data) => (this.activities = data)
    );

    return this.activities;
  }
}
