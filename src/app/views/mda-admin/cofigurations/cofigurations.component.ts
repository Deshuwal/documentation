import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";

@Component({
  selector: "app-cofigurations",
  templateUrl: "./cofigurations.component.html",
  styleUrls: ["./cofigurations.component.scss"],
})
export class CofigurationsComponent implements OnInit {
  active = 1;
  currentJustify = "fill";

  constructor(
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumb.setCrumbItem('setupConfiguration');
  }
}
