import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviousLGCRevenuePaymentsComponent } from "./previous-LGC-Revenue-payments.component";

describe("DashboardV2Component", () => {
	let component: PreviousLGCRevenuePaymentsComponent;
	let fixture: ComponentFixture<PreviousLGCRevenuePaymentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PreviousLGCRevenuePaymentsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PreviousLGCRevenuePaymentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
