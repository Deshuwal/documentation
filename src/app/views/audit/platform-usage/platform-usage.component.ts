import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {
  FormControl,
} from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/shared/utils';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { fromEvent } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './platform-usage.component.html',
  styleUrls: ['./platform-usage.component.scss'],
  animations: [SharedAnimations],
})

export class PlatformUsageComponent implements OnInit {
  @ViewChild('modalConfirm', { static: false }) private modalContent;
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild("xlsxtable", { static: false }) table: ElementRef;
    
  loading: boolean = false;

  userProfile: any;

  searchControl: FormControl = new FormControl();

  filteredItems: any[] = [];
  page: number = 1;
  offset: number = 0;
  nextPage: number;
  pageCount: number;
  perPageCount: number;
  previousPage: number;
  resultCount: number;
  pageNumber: number;
  totalCount: number;
  status: any;

  platformUsage: any = [];



  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  from: string;
  to: string;

  config = {
    displayKey: "title", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3,
    placeholder: "Filter by MDA",
    noResultsFound: "No results found!",
  };

  constructor(
    private dl: HttpService,
    private toastr: ToastrService,
    private localStore: LocalStoreService,
    private breadcrumb: BreadcrumbService
  ) {}

 
  /**
   * @param  {} {this.userProfile=this.localStore.getItem('user'
   * @param  {} ;this.breadcrumb.setCrumbItem('platformUsage'
   * @param  {} ;this.loadActivities(
   */
  ngOnInit() {
    this.userProfile = this.localStore.getItem('user');
    this.breadcrumb.setCrumbItem('platformUsage');
    this.loadActivities();
  }

  /**
   * @param  {} {fromEvent(this.input.nativeElement
   * @param  {} 'keyup'
   * @param  {} .pipe(filter(Boolean
   * @param  {} debounceTime(1000
   * @param  {} distinctUntilChanged(
   * @param  {} tap((
   * @param  {} =>{this.loading=true;this.dl.doGet(`audit/activities/?user=${this.input.nativeElement.value}`
   * @param  {any} .subscribe((res
   */
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.dl
            .doGet(`audit/activities/?user=${this.input.nativeElement.value}`)
            .subscribe(
              (res: any) => {
                const loadedAct: any = res.data.result || [];
                this.platformUsage = loadedAct.map((act, index) => ({
                  ...act,
                  sn: ++index,
                }));
                this.loading = false;
              },
              (err) => {
                this.loading = false;
              }
            );
        })
      )
      .subscribe();
  }
  /**
   * @param  {} {this.loading=true;this.dl.doGet(`audit/activities`
   * @param  {any} .subscribe((res
   */
  loadActivities() {
    this.loading = true;
    this.dl.doGet(`audit/activities`).subscribe(
      (res: any) => {
      if (res.data.result < 1) {
        this.toastr.info('No Records found ', 'Empty!', { timeOut: 3000 });
      }

      this.platformUsage = res.data.result;
      this.filteredItems = [...this.platformUsage];
      
      this.nextPage = res.data.next_page;
      this.previousPage = res.data.previous_page;
      this.pageCount = res.data.page_count;
      this.perPageCount = res.data.per_page_count;
      this.resultCount = res.data.result_count;
      this.totalCount = res.data.total_count;

      this.loading = false;
    },
    (err) => {
      this.loading = false;
    });
  }

  fileName = 'platform-usage.xlsx';

  data: any = [];

  
  /**
   * @param  {} {this.loading=true;leturl="audit/get_activities_by_date";url=`${url}?from=${this.from}&to=${this.to}`;this.dl.doGet(url
   * @param  {any} .subscribe((res
   */
  filterByDate() {
    this.loading = true;
    let url = "audit/get_activities_by_date";
    url = `${url}?from=${this.from}&to=${this.to}`;
    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.data.result.length < 1) {
          this.toastr.info("No records found ", "Empty!", { timeOut: 3000 });
        }
        
        this.data = res.data.result;
        this.filteredItems = [...this.data];
        
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log('error', err);
      }
    );
  }
 
  /**
   * 
   * @param date 
   * @returns 
   */
  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  /**
   * 
   * @param x 
   * @returns 
   */
  formatNumber(x: number) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x;
  }
}
