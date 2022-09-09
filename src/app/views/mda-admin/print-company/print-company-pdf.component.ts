import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import jsPDF from "jspdf";
import { HttpService } from "src/app/shared/services/http.service";
import { ActivatedRoute } from "@angular/router";
import html2canvas from "html2canvas";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-root",
  templateUrl: "./print-company-pdf.component.html",
  styleUrls: ["./print-company-pdf.component.scss"],
})
export class PrintCompanyPDF implements OnInit {
  company: any;
  id: string;

  @ViewChild("pdfTable", { static: false }) pdfTable: ElementRef;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private dl: HttpService,
    private breadcrumb: BreadcrumbService,
    private pdfService:PrintpdfService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
    this.breadcrumb.setCrumbItem("setupCompanyPreview");
  }

  printPDFS(div_id) {
  this.pdfService.printPdf(div_id,)
  }

  exportAsPDF(div_id) {
    this.pdfService.exportAsPDF(div_id,'company')
    }

  ngOnInit() {
    this.loading = true;
    this.dl.doGet("users/company/" + this.id).subscribe((res: any) => {
      console.log("company", res);
      this.company = res.data;
      this.loading = false;
    }),
      (err) => {
        this.loading = false;
        console.log(err);
      };
  }
}
