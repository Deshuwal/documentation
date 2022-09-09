import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import jsPDF from "jspdf";
import { HttpService } from "src/app/shared/services/http.service";
import { ActivatedRoute } from "@angular/router";
import html2canvas from "html2canvas";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { OldPlatformNegotiatorService } from "src/app/shared/services/old_platform_negotiator";

@Component({
  selector: "app-root",
  templateUrl: "./print-pdf.component.html",
  styleUrls: ["./print-pdf.component.scss"],
})
export class PrintUserPDF implements OnInit {
  user: any;
  id: string; 
  dateIssued: string =
    new Date().getDate() +
    "-" +
    new Date().getMonth() +
    1 +
    "-" +
    new Date().getFullYear();

  @ViewChild("pdfTable", { static: false }) pdfTable: ElementRef;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private dl: HttpService,
    public oldPlatformNegotiator: OldPlatformNegotiatorService,
    private breadcrumb: BreadcrumbService,
    private pdfService: PrintpdfService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  exportAsPDF(div_id) {
    this.pdfService.exportAsPDF(div_id, "taxt-enum");
  }

  printPDFS(div_id) {
    this.pdfService.printPdf(div_id);
  }

  ngOnInit() {
    this.loading = true;
    
    this.dl.doGet("users/get_user_by_id/" + this.id).subscribe((res: any) => {
      console.log("got user ",res);
      this.user = res.data;
      this.loading = false;
    }),
      (err) => {
        this.loading = false;
        console.log(err);
      };
    this.breadcrumb.setCrumbItem("Print");
  }


  getUserName(user){

    if(user.name && user.name.split(" ").length > 2) return user.name;


    let middle_name = user.other_names? user.other_names: "";
    return user.first_name +  " " + middle_name +  " "  +user.surname ;
  }
 
}
