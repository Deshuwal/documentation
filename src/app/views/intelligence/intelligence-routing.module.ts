import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { Role } from 'src/app/shared/models/role';
import { InsightComponent } from './insight/insight.component';
import { ImportCacComponent } from './import-cac/import-cac.component';
import { ImportPlasmidaComponent } from './import-plasmida/import-plasmida.component';
import { ImportAssociationComponent } from './import-association/import-association.component';
import { ImportYellowPagesComponent } from './import-yellow-pages/import-yellow-pages.component';
import { ImportOthersComponent } from './import-others/import-others.component';
import { AnalysisComponent } from './analysis/analysis.component';

const routes: Routes = [
 
  {
    path: 'analysis',
    component: AnalysisComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },

  {
    path: 'insight',
    component: InsightComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
  
  {
    path: 'import/cac',
    component: ImportCacComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
  {
    path: 'import/plasmida',
    component: ImportPlasmidaComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
  {
    path: 'import/association',
    component: ImportAssociationComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
  {
    path: 'import/yellow-pages',
    component: ImportYellowPagesComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
  {
    path: 'import/others',
    component: ImportOthersComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin, Role.MdaAdmin],
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntelligenceRoutingModule {}
