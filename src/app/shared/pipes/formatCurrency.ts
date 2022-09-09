import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "configureCurrency" })
export class ConfigureCurrency implements PipeTransform {
	transform(value: number, code: string): string {
		if (value < 1) return "";
		return new Intl.NumberFormat(code ? "ng-NG" : "en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(value);
	}
}
