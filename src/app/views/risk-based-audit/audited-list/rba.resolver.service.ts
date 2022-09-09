import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { AuditedListService } from "./rba.service";

@Injectable({
  providedIn: "root",
})
export class AuditedListResolver implements Resolve<{}> {
  activities;
  constructor(private auditedListService: AuditedListService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auditedListService.activity.subscribe(
      (data) => (this.activities = data)
    );

    return this.activities;
  }
}
