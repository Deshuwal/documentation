import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FixedTaxItemsComponent } from "./fixed_tax_items.component";

describe("PaymentHistoryComponent", () => {
	let component: FixedTaxItemsComponent;
	let fixture: ComponentFixture<FixedTaxItemsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FixedTaxItemsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FixedTaxItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
