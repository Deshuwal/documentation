import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ForgotTINComponent } from "./forgot.component";

describe("ForgotComponent", () => {
	let component: ForgotTINComponent;
	let fixture: ComponentFixture<ForgotTINComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ForgotTINComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ForgotTINComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
