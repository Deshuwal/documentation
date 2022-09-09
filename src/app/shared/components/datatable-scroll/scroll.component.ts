import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, IBreadCrumbData } from '../../services/breadcrumb.service';

@Component({
  selector: 'datatable-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class DatatableScrollComponent implements OnInit {
  breadItem: IBreadCrumbData;

  constructor(public breadcrumb: BreadcrumbService) {
    breadcrumb.setCrumbItem(null);
  }


  scrollLeft(){
    let current:number = document.getElementsByClassName("datatable-body")[0].scrollLeft; 
    current-=50;
    document.getElementsByClassName("datatable-body")[0].scrollLeft=current;
    document.getElementsByClassName("top-scroll")[0].scrollLeft=current;
  }


  scrollRight(){
 
    let current:number = document.getElementsByClassName("datatable-body")[0].scrollLeft;
     
    current+=50;
    document.getElementsByClassName("datatable-body")[0].scrollLeft=current; 
    document.getElementsByClassName("top-scroll")[0].scrollLeft=current;
  }
  ngOnInit() {
    
    
   
  }
}
