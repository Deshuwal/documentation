import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, IBreadCrumbData } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadItem: IBreadCrumbData;

  constructor(public breadcrumb: BreadcrumbService) {
    breadcrumb.setCrumbItem(null);
  }

  ngOnInit() {
    this.breadcrumb.crumbItem$.subscribe(item => this.breadItem = item);
  }
}
