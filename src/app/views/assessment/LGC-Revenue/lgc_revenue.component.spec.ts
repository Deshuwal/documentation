import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LgcRevenueComponent } from "./lgc_revenue.component";

describe("LgcRevenueComponent", () => {
	let component: LgcRevenueComponent;
	let fixture: ComponentFixture<LgcRevenueComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LgcRevenueComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LgcRevenueComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
