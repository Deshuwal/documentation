import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { IntelligenceRoutingModule } from './intelligence-routing.module';
import { ImportCustomComponent } from './import-custom/import-custom.component';
import { IntelligenceService } from './intelligence.service';
import { InsightComponent } from './insight/insight.component';
import { ImportCacComponent } from './import-cac/import-cac.component';
import { ImportPlasmidaComponent } from './import-plasmida/import-plasmida.component';
import { ImportAssociationComponent } from './import-association/import-association.component';
import { ImportYellowPagesComponent } from './import-yellow-pages/import-yellow-pages.component';
import { ImportOthersComponent } from './import-others/import-others.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AnalysisComponent } from './analysis/analysis.component';

@NgModule({
  declarations: [
    InsightComponent, 
    ImportCacComponent, 
    ImportPlasmidaComponent,
    ImportAssociationComponent,
    ImportCustomComponent,
    ImportOthersComponent,
    AnalysisComponent,
    ImportYellowPagesComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    SharedComponentsModule,
    IntelligenceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    SelectDropDownModule,
    NgxPaginationModule,
    NgxDatatableModule,
  ],
  exports: [FormsModule],
  providers: [IntelligenceService],
})
export class IntelligenceModule {}
