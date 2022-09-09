'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">PSIRS documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' : 'data-target="#xs-components-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' :
                                            'id="xs-components-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' : 'data-target="#xs-injectables-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' :
                                        'id="xs-injectables-links-module-AppModule-fea7f20149205b4a72b7ad28ca29ba16eec2eafb5b9ef36609308d778a0e6df160917c28f442d9a410e0b8c7b2dd6cb8833321c353f92ac557df2e198a5f8bd0"' }>
                                        <li class="link">
                                            <a href="injectables/ManageUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageUserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AssessmentModule.html" data-type="entity-link" >AssessmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' : 'data-target="#xs-components-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' :
                                            'id="xs-components-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' }>
                                            <li class="link">
                                                <a href="components/AssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BulkDemandNoticeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BulkDemandNoticeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsumptionTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsumptionTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DemandNoticeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DemandNoticeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntertainmentTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntertainmentTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LgcRevenueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LgcRevenueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModifyAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModifyAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MotorLicenseAuthority.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MotorLicenseAuthority</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Paye_calculatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Paye_calculatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalIncomeTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalIncomeTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PresumptiveComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PresumptiveComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PresumptiveTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PresumptiveTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PresumtiveTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PresumtiveTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousBulkAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousBulkAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousLGCRevenueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousLGCRevenueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousPresumptiveTaxAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousPresumptiveTaxAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoadTaxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoadTaxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewIndividualBulkAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewIndividualBulkAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewIndividualPresumptiveTaxAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewIndividualPresumptiveTaxAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewRegisteredVehicleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewRegisteredVehicleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' : 'data-target="#xs-pipes-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' :
                                            'id="xs-pipes-links-module-AssessmentModule-477fccac0109f8caa72ecec8c300db67c025975cd37315c2fea1692619b871819699e5a4096768cd6c6d848a8fda5646f5a6cb1926eb7f87fe2e1be3f42cbc9d"' }>
                                            <li class="link">
                                                <a href="pipes/ToNumberPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToNumberPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AssessmentRoutingModule.html" data-type="entity-link" >AssessmentRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuditModule.html" data-type="entity-link" >AuditModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuditModule-3944f18d491b1120b4c22c01d806ea8d019aadf2a2b1a9e7ed94663f12acadd654760264d0bf3b45334378cf622b2af4eaeadfd0735168e0309eb586ec51d7f5"' : 'data-target="#xs-components-links-module-AuditModule-3944f18d491b1120b4c22c01d806ea8d019aadf2a2b1a9e7ed94663f12acadd654760264d0bf3b45334378cf622b2af4eaeadfd0735168e0309eb586ec51d7f5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuditModule-3944f18d491b1120b4c22c01d806ea8d019aadf2a2b1a9e7ed94663f12acadd654760264d0bf3b45334378cf622b2af4eaeadfd0735168e0309eb586ec51d7f5"' :
                                            'id="xs-components-links-module-AuditModule-3944f18d491b1120b4c22c01d806ea8d019aadf2a2b1a9e7ed94663f12acadd654760264d0bf3b45334378cf622b2af4eaeadfd0735168e0309eb586ec51d7f5"' }>
                                            <li class="link">
                                                <a href="components/ActivityComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivityComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlatformUsageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlatformUsageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuditModule.html" data-type="entity-link" >AuditModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuditModule-1c01e63ee95c448fc35f3961f9c9cc0f4e796bab43a124b8d69e12cefde6341bc7bfd15f670821d11bb1cc5622033f901a7aa943b4f9e9288e8d47394005378a-1"' : 'data-target="#xs-components-links-module-AuditModule-1c01e63ee95c448fc35f3961f9c9cc0f4e796bab43a124b8d69e12cefde6341bc7bfd15f670821d11bb1cc5622033f901a7aa943b4f9e9288e8d47394005378a-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuditModule-1c01e63ee95c448fc35f3961f9c9cc0f4e796bab43a124b8d69e12cefde6341bc7bfd15f670821d11bb1cc5622033f901a7aa943b4f9e9288e8d47394005378a-1"' :
                                            'id="xs-components-links-module-AuditModule-1c01e63ee95c448fc35f3961f9c9cc0f4e796bab43a124b8d69e12cefde6341bc7bfd15f670821d11bb1cc5622033f901a7aa943b4f9e9288e8d47394005378a-1"' }>
                                            <li class="link">
                                                <a href="components/AuditedListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditedListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuditRoutingModule.html" data-type="entity-link" >AuditRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuditRoutingModule.html" data-type="entity-link" >AuditRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' : 'data-target="#xs-components-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' :
                                            'id="xs-components-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' }>
                                            <li class="link">
                                                <a href="components/ForgotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotEmailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotEmailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotTINComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotTINComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SigninComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SigninComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' : 'data-target="#xs-directives-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' :
                                        'id="xs-directives-links-module-AuthModule-f00b2a0fb604e75f320656282af4a4b648c1c2f569582952e86a5428b76ef8c368de35bc4ddb11e5a8fd122ec1a7f4d51d2b5719f8e0c23e97e5983ed426dffa"' }>
                                        <li class="link">
                                            <a href="directives/ConfirmEqualValidatorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmEqualValidatorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CalendarAppModule.html" data-type="entity-link" >CalendarAppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CalendarAppModule-0a7cfd280f3a509bc4fdc888b68a29cc647b2b361f7896b8277a9a08b3ea5128152b7c695c0c52d3778a091ed2a1ade723f208ebf705b82b9a98b6445e519349"' : 'data-target="#xs-components-links-module-CalendarAppModule-0a7cfd280f3a509bc4fdc888b68a29cc647b2b361f7896b8277a9a08b3ea5128152b7c695c0c52d3778a091ed2a1ade723f208ebf705b82b9a98b6445e519349"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CalendarAppModule-0a7cfd280f3a509bc4fdc888b68a29cc647b2b361f7896b8277a9a08b3ea5128152b7c695c0c52d3778a091ed2a1ade723f208ebf705b82b9a98b6445e519349"' :
                                            'id="xs-components-links-module-CalendarAppModule-0a7cfd280f3a509bc4fdc888b68a29cc647b2b361f7896b8277a9a08b3ea5128152b7c695c0c52d3778a091ed2a1ade723f208ebf705b82b9a98b6445e519349"' }>
                                            <li class="link">
                                                <a href="components/CalendarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalendarFormDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarFormDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CalendarRoutingModule.html" data-type="entity-link" >CalendarRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FormWizardModule.html" data-type="entity-link" >FormWizardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FormWizardModule-aaea5c8df58c6d5d9d0624210d0249eaa692a4ae03a5923173db802dfe235d03de0810acd377314606b6366cace18df0fb16a5ac3a657b94e0d3a631014f5ebc"' : 'data-target="#xs-components-links-module-FormWizardModule-aaea5c8df58c6d5d9d0624210d0249eaa692a4ae03a5923173db802dfe235d03de0810acd377314606b6366cace18df0fb16a5ac3a657b94e0d3a631014f5ebc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FormWizardModule-aaea5c8df58c6d5d9d0624210d0249eaa692a4ae03a5923173db802dfe235d03de0810acd377314606b6366cace18df0fb16a5ac3a657b94e0d3a631014f5ebc"' :
                                            'id="xs-components-links-module-FormWizardModule-aaea5c8df58c6d5d9d0624210d0249eaa692a4ae03a5923173db802dfe235d03de0810acd377314606b6366cace18df0fb16a5ac3a657b94e0d3a631014f5ebc"' }>
                                            <li class="link">
                                                <a href="components/WizardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WizardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WizardStepComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WizardStepComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IntelligenceModule.html" data-type="entity-link" >IntelligenceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' : 'data-target="#xs-components-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' :
                                            'id="xs-components-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' }>
                                            <li class="link">
                                                <a href="components/AnalysisComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnalysisComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportAssociationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportAssociationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportCacComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportCacComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportCustomComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportCustomComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportOthersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportOthersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportPlasmidaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportPlasmidaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportYellowPagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportYellowPagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InsightComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' : 'data-target="#xs-injectables-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' :
                                        'id="xs-injectables-links-module-IntelligenceModule-f829680ce7f28846e07335a527e246ae69f87157e98063da51060504e7ee7ae7dc089a475044ccef1a0279e33beea805573a8588b416c7671a43ec1a603fd8d2"' }>
                                        <li class="link">
                                            <a href="injectables/IntelligenceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntelligenceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/IntelligenceRoutingModule.html" data-type="entity-link" >IntelligenceRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LayoutsModule.html" data-type="entity-link" >LayoutsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LayoutsModule-17ccb0609cc29d3219cbd65df2a33c009bb9df1f8783f7cb286fb06665eecd569137bc63aee6b00ab257b738aeb0ec6b176b43757f748a75d05dc1ce024e6114"' : 'data-target="#xs-components-links-module-LayoutsModule-17ccb0609cc29d3219cbd65df2a33c009bb9df1f8783f7cb286fb06665eecd569137bc63aee6b00ab257b738aeb0ec6b176b43757f748a75d05dc1ce024e6114"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LayoutsModule-17ccb0609cc29d3219cbd65df2a33c009bb9df1f8783f7cb286fb06665eecd569137bc63aee6b00ab257b738aeb0ec6b176b43757f748a75d05dc1ce024e6114"' :
                                            'id="xs-components-links-module-LayoutsModule-17ccb0609cc29d3219cbd65df2a33c009bb9df1f8783f7cb286fb06665eecd569137bc63aee6b00ab257b738aeb0ec6b176b43757f748a75d05dc1ce024e6114"' }>
                                            <li class="link">
                                                <a href="components/BreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BtnLoadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BtnLoadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateDataCategoryCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateDataCategoryCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatatableScrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatatableScrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeatherIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeatherIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayeReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayeReceiptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecaptchaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecaptchaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaxEnumerationCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaxEnumerationCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TestPaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TestPaymentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MdaAdminModule.html" data-type="entity-link" >MdaAdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MdaAdminModule-446f4678e6e42bbae3a8035b29a327a227f2c096731843ae728cb7699cffe41aca3f77eb98c434449431c27e4810025c23773dbe010328a3d920c2341477da69"' : 'data-target="#xs-components-links-module-MdaAdminModule-446f4678e6e42bbae3a8035b29a327a227f2c096731843ae728cb7699cffe41aca3f77eb98c434449431c27e4810025c23773dbe010328a3d920c2341477da69"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MdaAdminModule-446f4678e6e42bbae3a8035b29a327a227f2c096731843ae728cb7699cffe41aca3f77eb98c434449431c27e4810025c23773dbe010328a3d920c2341477da69"' :
                                            'id="xs-components-links-module-MdaAdminModule-446f4678e6e42bbae3a8035b29a327a227f2c096731843ae728cb7699cffe41aca3f77eb98c434449431c27e4810025c23773dbe010328a3d920c2341477da69"' }>
                                            <li class="link">
                                                <a href="components/AuditTargetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditTargetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BusinessIndustryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusinessIndustryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CofigurationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CofigurationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmploymentStatusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmploymentStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixedTaxItemsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FixedTaxItemsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GenderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageBusinessIndustriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageBusinessIndustriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Manage_companiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Manage_companiesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Manage_usersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Manage_usersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MaritalStatusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MaritalStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MdaBulkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MdaBulkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MdaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MdaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OccupationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OccupationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrintCompanyPDF.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrintCompanyPDF</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RulesBulkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RulesBulkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaxItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaxItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TitlesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TitlesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MdaRoutingModule.html" data-type="entity-link" >MdaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OthersModule.html" data-type="entity-link" >OthersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OthersModule-b4fd7b60884843ba1a56ce2ff6115180362369dad9f4c93eba8f72b49341a0a0c7a94233c4debba33daff4b6d516afd27d9fc3fda0a37da5627b91db3a0c84dd"' : 'data-target="#xs-components-links-module-OthersModule-b4fd7b60884843ba1a56ce2ff6115180362369dad9f4c93eba8f72b49341a0a0c7a94233c4debba33daff4b6d516afd27d9fc3fda0a37da5627b91db3a0c84dd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OthersModule-b4fd7b60884843ba1a56ce2ff6115180362369dad9f4c93eba8f72b49341a0a0c7a94233c4debba33daff4b6d516afd27d9fc3fda0a37da5627b91db3a0c84dd"' :
                                            'id="xs-components-links-module-OthersModule-b4fd7b60884843ba1a56ce2ff6115180362369dad9f4c93eba8f72b49341a0a0c7a94233c4debba33daff4b6d516afd27d9fc3fda0a37da5627b91db3a0c84dd"' }>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OthersRoutingModule.html" data-type="entity-link" >OthersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PaymentModule-1c07d1796dd0b0b2903a70422952a9c5c55a5ab76d804d5ed0e622eed6d96ccbba13849ae907754853ee6cde6405f4234ce9b41a4978e1bd6851d935ea5da5fb"' : 'data-target="#xs-components-links-module-PaymentModule-1c07d1796dd0b0b2903a70422952a9c5c55a5ab76d804d5ed0e622eed6d96ccbba13849ae907754853ee6cde6405f4234ce9b41a4978e1bd6851d935ea5da5fb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PaymentModule-1c07d1796dd0b0b2903a70422952a9c5c55a5ab76d804d5ed0e622eed6d96ccbba13849ae907754853ee6cde6405f4234ce9b41a4978e1bd6851d935ea5da5fb"' :
                                            'id="xs-components-links-module-PaymentModule-1c07d1796dd0b0b2903a70422952a9c5c55a5ab76d804d5ed0e622eed6d96ccbba13849ae907754853ee6cde6405f4234ce9b41a4978e1bd6851d935ea5da5fb"' }>
                                            <li class="link">
                                                <a href="components/AgentTransactionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AgentTransactionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PAYEBulkPaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PAYEBulkPaymentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PAYEBulkPaymentHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PAYEBulkPaymentHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentDownloadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentDownloadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentLgcRevenueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentLgcRevenueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentReceiptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PresumptiveBulkPaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PresumptiveBulkPaymentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PresumptiveBulkPaymentHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PresumptiveBulkPaymentHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousLGCRevenuePaymentsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousLGCRevenuePaymentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TINHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TINHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WalletComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WalletComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentRoutingModule.html" data-type="entity-link" >PaymentRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterModule.html" data-type="entity-link" >RegisterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegisterModule-5404307962e5bbd7c869afc0906aee905cfb28ba29299b90425e187165df159c769004e650c738b130440500c9327b869997f0d6cc186bd3418167c7dc092a93"' : 'data-target="#xs-components-links-module-RegisterModule-5404307962e5bbd7c869afc0906aee905cfb28ba29299b90425e187165df159c769004e650c738b130440500c9327b869997f0d6cc186bd3418167c7dc092a93"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterModule-5404307962e5bbd7c869afc0906aee905cfb28ba29299b90425e187165df159c769004e650c738b130440500c9327b869997f0d6cc186bd3418167c7dc092a93"' :
                                            'id="xs-components-links-module-RegisterModule-5404307962e5bbd7c869afc0906aee905cfb28ba29299b90425e187165df159c769004e650c738b130440500c9327b869997f0d6cc186bd3418167c7dc092a93"' }>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupwtComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupwtComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupwtJTBComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupwtJTBComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupwtNINComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupwtNINComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReportingModule.html" data-type="entity-link" >ReportingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReportingModule-801acdd9d79e4d33d6d2257b61a2993f08d9941ec5a82eac2965a4baab6fffa32f37497c901bef10bb9ccc162deed40d2cf415c1f9ca70d9fb4967df059f1767"' : 'data-target="#xs-components-links-module-ReportingModule-801acdd9d79e4d33d6d2257b61a2993f08d9941ec5a82eac2965a4baab6fffa32f37497c901bef10bb9ccc162deed40d2cf415c1f9ca70d9fb4967df059f1767"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReportingModule-801acdd9d79e4d33d6d2257b61a2993f08d9941ec5a82eac2965a4baab6fffa32f37497c901bef10bb9ccc162deed40d2cf415c1f9ca70d9fb4967df059f1767"' :
                                            'id="xs-components-links-module-ReportingModule-801acdd9d79e4d33d6d2257b61a2993f08d9941ec5a82eac2965a4baab6fffa32f37497c901bef10bb9ccc162deed40d2cf415c1f9ca70d9fb4967df059f1767"' }>
                                            <li class="link">
                                                <a href="components/MDASBreakdown.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MDASBreakdown</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OtherMDARevenueBreakdown.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OtherMDARevenueBreakdown</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PsirsBreakdown.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PsirsBreakdown</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReportingRoutingModule.html" data-type="entity-link" >ReportingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RevenueReturnModule.html" data-type="entity-link" >RevenueReturnModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RevenueReturnModule-6cd369392a12c92b4fd3cce86f9043e2bf66dcbc268d5480b9adf5d62966d3ebeaa56eceb9df97c93c38d56b288b65f05e26b20b806dc8d997266c65cad3cdc8"' : 'data-target="#xs-components-links-module-RevenueReturnModule-6cd369392a12c92b4fd3cce86f9043e2bf66dcbc268d5480b9adf5d62966d3ebeaa56eceb9df97c93c38d56b288b65f05e26b20b806dc8d997266c65cad3cdc8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RevenueReturnModule-6cd369392a12c92b4fd3cce86f9043e2bf66dcbc268d5480b9adf5d62966d3ebeaa56eceb9df97c93c38d56b288b65f05e26b20b806dc8d997266c65cad3cdc8"' :
                                            'id="xs-components-links-module-RevenueReturnModule-6cd369392a12c92b4fd3cce86f9043e2bf66dcbc268d5480b9adf5d62966d3ebeaa56eceb9df97c93c38d56b288b65f05e26b20b806dc8d997266c65cad3cdc8"' }>
                                            <li class="link">
                                                <a href="components/CorporateRevenueReturnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CorporateRevenueReturnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IndividualRevenueReturnsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IndividualRevenueReturnsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousRevenueReturnAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousRevenueReturnAssessmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousRevenueReturnCorporateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousRevenueReturnCorporateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousRevenueReturnsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousRevenueReturnsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewIndividualRevenuReturnAssessmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewIndividualRevenuReturnAssessmentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RevenueReturnRoutingModule.html" data-type="entity-link" >RevenueReturnRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SearchModule.html" data-type="entity-link" >SearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SearchModule-9a8cd1a4f9ba54d4b67fa928402fd65cf48ba9c727594709055f95700ee46f87fd928aea7cc044bd778052788253b2b64cb85cd4831a7422f32a2a10159249d2"' : 'data-target="#xs-components-links-module-SearchModule-9a8cd1a4f9ba54d4b67fa928402fd65cf48ba9c727594709055f95700ee46f87fd928aea7cc044bd778052788253b2b64cb85cd4831a7422f32a2a10159249d2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SearchModule-9a8cd1a4f9ba54d4b67fa928402fd65cf48ba9c727594709055f95700ee46f87fd928aea7cc044bd778052788253b2b64cb85cd4831a7422f32a2a10159249d2"' :
                                            'id="xs-components-links-module-SearchModule-9a8cd1a4f9ba54d4b67fa928402fd65cf48ba9c727594709055f95700ee46f87fd928aea7cc044bd778052788253b2b64cb85cd4831a7422f32a2a10159249d2"' }>
                                            <li class="link">
                                                <a href="components/SearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SessionsRoutingModule.html" data-type="entity-link" >SessionsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedComponentsModule.html" data-type="entity-link" >SharedComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedComponentsModule-59dc97567ae642588b77f96578718ee180794bcf6c9ba993f48526fa88f94a09f4d7a330a30944b13286996503c34ee08cbc3e5728da6c591c16a921cc3f9a58"' : 'data-target="#xs-components-links-module-SharedComponentsModule-59dc97567ae642588b77f96578718ee180794bcf6c9ba993f48526fa88f94a09f4d7a330a30944b13286996503c34ee08cbc3e5728da6c591c16a921cc3f9a58"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedComponentsModule-59dc97567ae642588b77f96578718ee180794bcf6c9ba993f48526fa88f94a09f4d7a330a30944b13286996503c34ee08cbc3e5728da6c591c16a921cc3f9a58"' :
                                            'id="xs-components-links-module-SharedComponentsModule-59dc97567ae642588b77f96578718ee180794bcf6c9ba993f48526fa88f94a09f4d7a330a30944b13286996503c34ee08cbc3e5728da6c591c16a921cc3f9a58"' }>
                                            <li class="link">
                                                <a href="components/BreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BtnLoadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BtnLoadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateDataCategoryCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateDataCategoryCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatatableScrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatatableScrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeatherIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeatherIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayeReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayeReceiptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecaptchaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecaptchaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaxEnumerationCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaxEnumerationCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TestPaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TestPaymentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedDirectivesModule.html" data-type="entity-link" >SharedDirectivesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedDirectivesModule-d58479511a84cb57fff09d429213fa2fb156a12df6421004c28da41f44bd6583546ebcb5b38f95d88fe8cc6a433dcb6abffa1041c2f228c8b7ea7a300b599562"' : 'data-target="#xs-directives-links-module-SharedDirectivesModule-d58479511a84cb57fff09d429213fa2fb156a12df6421004c28da41f44bd6583546ebcb5b38f95d88fe8cc6a433dcb6abffa1041c2f228c8b7ea7a300b599562"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedDirectivesModule-d58479511a84cb57fff09d429213fa2fb156a12df6421004c28da41f44bd6583546ebcb5b38f95d88fe8cc6a433dcb6abffa1041c2f228c8b7ea7a300b599562"' :
                                        'id="xs-directives-links-module-SharedDirectivesModule-d58479511a84cb57fff09d429213fa2fb156a12df6421004c28da41f44bd6583546ebcb5b38f95d88fe8cc6a433dcb6abffa1041c2f228c8b7ea7a300b599562"' }>
                                        <li class="link">
                                            <a href="directives/AppDropdownDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppDropdownDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DropdownAnchorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DropdownAnchorDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DropdownLinkDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DropdownLinkDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/FullScreenWindowDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FullScreenWindowDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/HighlightjsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HighlightjsDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ScrollToDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScrollToDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SidebarContainerDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarContainerDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SidebarContentDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarContentDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SidebarDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SidebarTogglerDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarTogglerDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedPipesModule.html" data-type="entity-link" >SharedPipesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedPipesModule-2494ae34f4846d7114f31ec3ca604d11233ffa4083df5f42a1c38660dd62ee0c482b48770f2bae48a97e033d95d69345e561362755bcc9a88a880a0d7057d477"' : 'data-target="#xs-pipes-links-module-SharedPipesModule-2494ae34f4846d7114f31ec3ca604d11233ffa4083df5f42a1c38660dd62ee0c482b48770f2bae48a97e033d95d69345e561362755bcc9a88a880a0d7057d477"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedPipesModule-2494ae34f4846d7114f31ec3ca604d11233ffa4083df5f42a1c38660dd62ee0c482b48770f2bae48a97e033d95d69345e561362755bcc9a88a880a0d7057d477"' :
                                            'id="xs-pipes-links-module-SharedPipesModule-2494ae34f4846d7114f31ec3ca604d11233ffa4083df5f42a1c38660dd62ee0c482b48770f2bae48a97e033d95d69345e561362755bcc9a88a880a0d7057d477"' }>
                                            <li class="link">
                                                <a href="pipes/ConfigureCurrency.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigureCurrency</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ConvertDatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConvertDatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/EmailAsteriskPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailAsteriskPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ExcerptPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExcerptPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/GetValueByKeyPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetValueByKeyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/RelativeTimePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RelativeTimePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ToNumberPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToNumberPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaxpayerModule.html" data-type="entity-link" >TaxpayerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TaxpayerModule-f39b88382e79ead0f4a88c7cea405dfe231e155fd05e686843821d21f8e4bace4caf369b2fd785f0403e09cb1a9698d0430e4711afe30da3c4a85a8af0a64ddc"' : 'data-target="#xs-components-links-module-TaxpayerModule-f39b88382e79ead0f4a88c7cea405dfe231e155fd05e686843821d21f8e4bace4caf369b2fd785f0403e09cb1a9698d0430e4711afe30da3c4a85a8af0a64ddc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TaxpayerModule-f39b88382e79ead0f4a88c7cea405dfe231e155fd05e686843821d21f8e4bace4caf369b2fd785f0403e09cb1a9698d0430e4711afe30da3c4a85a8af0a64ddc"' :
                                            'id="xs-components-links-module-TaxpayerModule-f39b88382e79ead0f4a88c7cea405dfe231e155fd05e686843821d21f8e4bace4caf369b2fd785f0403e09cb1a9698d0430e4711afe30da3c4a85a8af0a64ddc"' }>
                                            <li class="link">
                                                <a href="components/ChangeUserPassword.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangeUserPassword</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompleteProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompleteProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboadDefaultComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboadDefaultComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MigrateCompanyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MigrateCompanyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MigrateUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MigrateUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrintUserPDF.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrintUserPDF</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterCompanyBulkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterCompanyBulkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterCompanyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterCompanyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterUserBulkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterUserBulkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterVendorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterVendorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaxpayerModule.html" data-type="entity-link" >TaxpayerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TaxpayerModule-196cc51d7a4308768da2ea3ca0834537ba69fad963ab36c1920892774995f80444590bba847c6137732fbcf71e1cadbf8c9f699184848ccb30f3737b02ef642f-1"' : 'data-target="#xs-components-links-module-TaxpayerModule-196cc51d7a4308768da2ea3ca0834537ba69fad963ab36c1920892774995f80444590bba847c6137732fbcf71e1cadbf8c9f699184848ccb30f3737b02ef642f-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TaxpayerModule-196cc51d7a4308768da2ea3ca0834537ba69fad963ab36c1920892774995f80444590bba847c6137732fbcf71e1cadbf8c9f699184848ccb30f3737b02ef642f-1"' :
                                            'id="xs-components-links-module-TaxpayerModule-196cc51d7a4308768da2ea3ca0834537ba69fad963ab36c1920892774995f80444590bba847c6137732fbcf71e1cadbf8c9f699184848ccb30f3737b02ef642f-1"' }>
                                            <li class="link">
                                                <a href="components/GenerateTccComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenerateTccComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviousTccComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreviousTccComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrintTccComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrintTccComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaxpayerRoutingModule.html" data-type="entity-link" >TaxpayerRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TaxpayerRoutingModule.html" data-type="entity-link" >TaxpayerRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ActivityComponent-1.html" data-type="entity-link" >ActivityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivityComponent-2.html" data-type="entity-link" >ActivityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminLayoutSidebarCompactComponent.html" data-type="entity-link" >AdminLayoutSidebarCompactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminLayoutSidebarLargeComponent.html" data-type="entity-link" >AdminLayoutSidebarLargeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthLayoutComponent.html" data-type="entity-link" >AuthLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlankLayoutComponent.html" data-type="entity-link" >BlankLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CustomizerComponent.html" data-type="entity-link" >CustomizerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderSidebarCompactComponent.html" data-type="entity-link" >HeaderSidebarCompactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderSidebarLargeComponent.html" data-type="entity-link" >HeaderSidebarLargeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Manage_companiesComponent-1.html" data-type="entity-link" >Manage_companiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Manage_usersComponent-1.html" data-type="entity-link" >Manage_usersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Manage_usersComponent-2.html" data-type="entity-link" >Manage_usersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PayeComponent-1.html" data-type="entity-link" >PayeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaymentHistoryComponent-1.html" data-type="entity-link" >PaymentHistoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarCompactComponent.html" data-type="entity-link" >SidebarCompactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarLargeComponent.html" data-type="entity-link" >SidebarLargeComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AnalysisSummary.html" data-type="entity-link" >AnalysisSummary</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuditActivityService.html" data-type="entity-link" >AuditActivityService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuditActivityService-1.html" data-type="entity-link" >AuditActivityService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CalendarAppEvent.html" data-type="entity-link" >CalendarAppEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CalendarEventDB.html" data-type="entity-link" >CalendarEventDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatDB.html" data-type="entity-link" >ChatDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/CountryDB.html" data-type="entity-link" >CountryDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataTablesResponse.html" data-type="entity-link" >DataTablesResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/echartStyles.html" data-type="entity-link" >echartStyles</a>
                            </li>
                            <li class="link">
                                <a href="classes/Environment.html" data-type="entity-link" >Environment</a>
                            </li>
                            <li class="link">
                                <a href="classes/Exporter.html" data-type="entity-link" >Exporter</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryDataService.html" data-type="entity-link" >InMemoryDataService</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvoiceDB.html" data-type="entity-link" >InvoiceDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/IRAS_logger.html" data-type="entity-link" >IRAS_logger</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailDB.html" data-type="entity-link" >MailDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/ManageUserService.html" data-type="entity-link" >ManageUserService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ManageUserService-1.html" data-type="entity-link" >ManageUserService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher.html" data-type="entity-link" >MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/Page.html" data-type="entity-link" >Page</a>
                            </li>
                            <li class="link">
                                <a href="classes/PayeeCalculator.html" data-type="entity-link" >PayeeCalculator</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person.html" data-type="entity-link" >Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person-1.html" data-type="entity-link" >Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person-2.html" data-type="entity-link" >Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductDB.html" data-type="entity-link" >ProductDB</a>
                            </li>
                            <li class="link">
                                <a href="classes/Utils.html" data-type="entity-link" >Utils</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AssessmentService.html" data-type="entity-link" >AssessmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuditedListService.html" data-type="entity-link" >AuditedListService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BreadcrumbService.html" data-type="entity-link" >BreadcrumbService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarAppService.html" data-type="entity-link" >CalendarAppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomizerService.html" data-type="entity-link" >CustomizerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataLayerService.html" data-type="entity-link" >DataLayerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DropdownDataService.html" data-type="entity-link" >DropdownDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpService.html" data-type="entity-link" >HttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStoreService.html" data-type="entity-link" >LocalStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ManageUserService.html" data-type="entity-link" >ManageUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MockDataService.html" data-type="entity-link" >MockDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OldPlatformNegotiatorService.html" data-type="entity-link" >OldPlatformNegotiatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaymentService.html" data-type="entity-link" >PaymentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionService.html" data-type="entity-link" >PermissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrintpdfService.html" data-type="entity-link" >PrintpdfService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RiskBasedAuditService.html" data-type="entity-link" >RiskBasedAuditService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SelfAssessmentService.html" data-type="entity-link" >SelfAssessmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidebarHelperService.html" data-type="entity-link" >SidebarHelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TinService.html" data-type="entity-link" >TinService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilityService.html" data-type="entity-link" >UtilityService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/UnauthorizedErrorInterceptor.html" data-type="entity-link" >UnauthorizedErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuditActivityResolver.html" data-type="entity-link" >AuditActivityResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuditActivityResolver-1.html" data-type="entity-link" >AuditActivityResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuditActivityResolver-2.html" data-type="entity-link" >AuditActivityResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuditedListResolver.html" data-type="entity-link" >AuditedListResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGaurd.html" data-type="entity-link" >AuthGaurd</a>
                            </li>
                            <li class="link">
                                <a href="guards/ManageUserResolver.html" data-type="entity-link" >ManageUserResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ManageUserResolver-1.html" data-type="entity-link" >ManageUserResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ManageUserResolver-2.html" data-type="entity-link" >ManageUserResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DirectAssment.html" data-type="entity-link" >DirectAssment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormModel.html" data-type="entity-link" >FormModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivityLog.html" data-type="entity-link" >IActivityLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivityLog-1.html" data-type="entity-link" >IActivityLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivityLog-2.html" data-type="entity-link" >IActivityLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IApproveRes.html" data-type="entity-link" >IApproveRes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBadge.html" data-type="entity-link" >IBadge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBreadCrumbData.html" data-type="entity-link" >IBreadCrumbData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBreadCrumbItem.html" data-type="entity-link" >IBreadCrumbItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBusiness.html" data-type="entity-link" >IBusiness</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBusinessType.html" data-type="entity-link" >IBusinessType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IChildItem.html" data-type="entity-link" >IChildItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICompany.html" data-type="entity-link" >ICompany</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelCompany.html" data-type="entity-link" >IExcelCompany</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-1.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-2.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-3.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-4.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-5.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-6.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExcelUser-7.html" data-type="entity-link" >IExcelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILGC.html" data-type="entity-link" >ILGC</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILGCType.html" data-type="entity-link" >ILGCType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILGRevenueHeadC.html" data-type="entity-link" >ILGRevenueHeadC</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenuItem.html" data-type="entity-link" >IMenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INotice.html" data-type="entity-link" >INotice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INoticeRes.html" data-type="entity-link" >INoticeRes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRegInsight.html" data-type="entity-link" >IRegInsight</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISelectedAgent.html" data-type="entity-link" >ISelectedAgent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISidebarState.html" data-type="entity-link" >ISidebarState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITagUser.html" data-type="entity-link" >ITagUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITagUser-1.html" data-type="entity-link" >ITagUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-1.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-2.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-3.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-4.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-5.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-6.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-7.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectorAuddit.html" data-type="entity-link" >SectorAuddit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectorAuddit-1.html" data-type="entity-link" >SectorAuddit</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});