import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActivityComponent } from "./activity/activity.component";
import { AuthGaurd } from "../../shared/services/auth.gaurd";
import { Role } from "src/app/shared/models/role";
import { PlatformUsageComponent } from "./platform-usage/platform-usage.component";


const routes: Routes = [
  {
    path: 'activities',
    component: ActivityComponent,
    canActivate: [ AuthGaurd ],
    data: {
      roles: [Role.SuperAdmin]
    }
  },
  {
    path: 'platform-usage',
    component: PlatformUsageComponent,
    canActivate: [ AuthGaurd ],
    data: {
      roles: [Role.SuperAdmin]
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {
}
