import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentLgcRevenueComponent } from "./payments_lgc_revenues.component";

describe("PaymentLgcRevenueComponent", () => {
	let component: PaymentLgcRevenueComponent;
	let fixture: ComponentFixture<PaymentLgcRevenueComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PaymentLgcRevenueComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PaymentLgcRevenueComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
