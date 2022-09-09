import { Component, Input, OnInit } from "@angular/core";
import { PrintpdfService } from "../../services/printpdf.service";
import { OldPlatformNegotiatorService } from "../../services/old_platform_negotiator";
import { UtilityService } from "../../services/utility";
import {
	NgbActiveModal,
	NgbModal,
	ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "create-data-category-card",
  templateUrl: "./create-data-category-card.component.html",
  styleUrls: ["./create-data-category-card.component.scss"],
})
export class CreateDataCategoryCardComponent implements OnInit {
  @Input("loading") loading: boolean;
  @Input("taxEnumeration") taxEnumeration: any = {};
  @Input("taxEnumViewType") taxEnumViewType = null; 
  closeResult = "";

  constructor(
    private printPDF: PrintpdfService,
	public negotiator: OldPlatformNegotiatorService,
	public utils:UtilityService,
    private modalService: NgbModal
    ) { }

  ngOnInit() { }

  exportAsPDF(div) {
    this.printPDF.exportAsPDF(
      div,
      this.taxEnumViewType + "-tax-enumeration.pdf"
    );
  }


	closeModal() {
		this.modalService.dismissAll();
  }
  
  open(content, item, type = null) {


		this.modalService
			.open(content, { ariaLabelledBy: "modal-basic-title" })
			.result.then(
				(result) => {
					this.closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}

  printPDFS(div) {
    this.printPDF.printPdf(div)
  }
}
