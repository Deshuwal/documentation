import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { HttpService } from "src/app/shared/services/http.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
	selector: "app-print-tcc",
	templateUrl: "./print-tcc.component.html",
	styleUrls: ["./print-tcc.component.scss"],
})
export class PrintTccComponent implements OnInit {
	id: string;
	loading = false;
	tcc: any = {};

	constructor(
		private route: ActivatedRoute,
		private dl: HttpService,
		private breadcrumb: BreadcrumbService,
		private toastService: ToastrService,
		private pdfService: PrintpdfService
	) {
		this.route.params.subscribe((params) => {
			this.id = params["id"];
		});
	}

	a = [
		"",
		"one ",
		"two ",
		"three ",
		"four ",
		"five ",
		"six ",
		"seven ",
		"eight ",
		"nine ",
		"ten ",
		"eleven ",
		"twelve ",
		"thirteen ",
		"fourteen ",
		"fifteen ",
		"sixteen ",
		"seventeen ",
		"eighteen ",
		"nineteen ",
	];
	b = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety",
	];

	inWords(num) {
		if ((num = num.toString()).length > 9) return "overflow";
		var n = ("000000000" + num)
			.substr(-9)
			.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = "";
		str +=
			(str != "" ? "and " : "") +
			(this.a[Number(n[5])] || this.b[n[5][0]] + " " + this.a[n[5][1]]);

		return str;
	}
	fetchTcc() {
		this.loading = true;
		this.dl.doGet("/tcc/find/" + this.id).subscribe(
			(res: any) => {
				this.loading = false;
				this.tcc = { ...res.data, payments: JSON.parse(res.data.payments) };
			},
			(err) => {
				this.loading = false;
				this.toastService.success("An error occurred");
			}
		);
	}
	ngOnInit() {
		this.fetchTcc();
	}

	printPDFS(div_id) {
		this.pdfService.printPdf(div_id);
	}

	exportAsPDF(div_id) {
		this.pdfService.exportAsPDF(div_id, "company");
	}
}
