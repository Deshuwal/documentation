import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { RiskBasedAuditService } from "./rba.service";

@Injectable({
  providedIn: "root",
})
export class AuditActivityResolver implements Resolve<{}> {
  activities;
  constructor(private activityService: RiskBasedAuditService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.activityService.activity.subscribe((data) => (this.activities = data));

    return this.activities;
  }
}
