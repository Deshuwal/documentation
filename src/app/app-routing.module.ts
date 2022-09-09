/**
 * this file handles the main entry point of the programme
 * where it route to the sub-route within the module of every view component and also shared
 * this also has two basic route with consist of admin and others (autherized and unautherized)
 */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthLayoutComponent } from "./shared/components/layouts/auth-layout/auth-layout.component";
import { AdminLayoutSidebarCompactComponent } from "./shared/components/layouts/admin-layout-sidebar-compact/admin-layout-sidebar-compact.component";
const dashboardRoutes: Routes = [//handles admin nav routing authorized through all modules and sub-modules
  {//this point to a taxpayer path module 
    path: "taxpayer",
    loadChildren: () =>
      import("./views/taxpayer/taxpayer.module").then((m) => m.TaxpayerModule),
  },
  {
    path: "tcc",
    loadChildren: () =>
      import("./views/tcc/tcc.module").then((m) => m.TaxpayerModule),
  },
  {
    path: "revenue-returns",
    loadChildren: () =>
      import("./views/revenue-return/revenue-return.module").then((m) => m.RevenueReturnModule),
  },
  {
    path: "setup",
    loadChildren: () =>
      import("./views/mda-admin/mda-admin.module").then(
        (m) => m.MdaAdminModule
      ),
  },
  {
    path: "reporting",
    loadChildren: () =>
      import("./views/reporting/reporting.module").then(
        (m) => m.ReportingModule
      ),
  },

  {
    path: "calendar",
    loadChildren: () =>
      import("./views/calendar/calendar.module").then(
        (m) => m.CalendarAppModule
      ),
  },

  {
    path: "assessment",
    loadChildren: () =>
      import("./views/assessment/assessment.module").then(
        (m) => m.AssessmentModule
      ),
  },
  {
    path: "risk-based-audit",
    loadChildren: () =>
      import("./views/risk-based-audit/audit.module").then(
        (m) => m.AuditModule
      ),
  },
  {
    path: "payment",
    loadChildren: () =>
      import("./views/payments/payment.module").then((m) => m.PaymentModule),
  },
  {
    path: "audit",
    loadChildren: () =>
      import("./views/audit/audit.module").then((m) => m.AuditModule),
  },
  {
    path: "intelligence",
    loadChildren: () =>
      import("./views/intelligence/intelligence.module").then(
        (m) => m.IntelligenceModule
      ),
  },
];

const routes: Routes = [
  /**this handles unauthized user path (ordinary users)
  *this path enable ordinary users to hit the sigin module and it sub-module
  */
  {  path: "",
    redirectTo: "auth/signin",
    pathMatch: "full",
  },

  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import("./views/auth/auth.module").then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "register",
        loadChildren: () =>
          import("./views/register/register.module").then(
            (m) => m.RegisterModule
          ),
      },
    ],
  },
  {
    path: "",
    component: AdminLayoutSidebarCompactComponent,
    children: dashboardRoutes,
  },
  {
    path: "**",
    redirectTo: "others/404",
  },
];
/**
 * this handles modules export and import with the route
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
