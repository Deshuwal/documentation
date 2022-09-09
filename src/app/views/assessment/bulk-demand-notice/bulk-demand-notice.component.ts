import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AssessmentService } from 'src/app/shared/services/assessment.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { Utils } from 'src/app/shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

interface INotice {
  sn?: number;
  bulk_id: string;
  bulk_name: string;
  mda_id: number;
  tax_item_id: number;
  demand_notice_ref?: string;
  bulk_count: number;
  created_at: number;
  creator: string;
  mda: string;
  tax_item: string;
}

interface INoticeRes {
  status: string;
  message: string;
  data: {
    result: INotice[];
    result_count: number;
    result_from: number;
    result_to: number;
    total_count: number;
    per_page_count: number;
    page_count: number;
    previous_page?: number;
    next_page?: number;
  };
}

interface IApproveRes {
  status: string;
  message: string;
}

@Component({
  selector: 'app-bulk-demand-notice',
  templateUrl: './bulk-demand-notice.component.html',
  styleUrls: ['./bulk-demand-notice.component.scss'],
  animations: [SharedAnimations],
})
export class BulkDemandNoticeComponent implements OnInit {
  public userProfile: any;
  public notices: INotice[] = [];

  public loading: boolean = false;
  public searching: boolean = false;
  public approving: boolean = false;

  public page: number = 1;
  public offset: number = 0;
  public nextPage: number;
  public pageCount: number;
  public perPageCount: number;
  public previousPage: number;
  public resultCount: number;
  public pageNumber: number;
  public totalCount: number;

  private approveBulkId: string;
  private searchText: string = null;

  @ViewChild('searchBox', { static: false }) private searchBox: ElementRef;
  @ViewChild("confirmModal", { static: false }) private confirmModal;


  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private localStore: LocalStoreService,
    private breadcrumb: BreadcrumbService,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem('user');
    this.breadcrumb.setCrumbItem('bulkDemandNotices');
    this.searching = true;
    this.loadNotices();
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1000), 
        distinctUntilChanged(),
        tap(() => {
          
          this.searching = true;
          this.searchText = this.searchBox.nativeElement.value.trim();

          if (this.searchText.length < 1) {
            this.loadNotices();
            return;
          }
          const searchUrl = `assessment/list_bulk_demand_notcies/?bulk_id=${this.searchText}&bulk_name=${this.searchText}`;
          this.loadNotices(searchUrl);
        })
      )
      .subscribe();
  }

  nextPageCall(page: any) {
    if(this.offset == page.offset) {
      return;
    }

    this.offset = page.offset;
    this.page = this.offset + 1;

    let currentPageLink = `assessment/list_bulk_demand_notcies/${this.page}`;

    if (this.searchText.length) {
      currentPageLink = `${currentPageLink}/?bulk_id=${this.searchText}&bulk_name=${this.searchText}`;
    }
    this.loadNotices(currentPageLink);    
  }

  approveBulkNotice(bulkId) {
    this.approving = false;
    this.approveBulkId = bulkId;
    this.modalService.open(this.confirmModal);
  }

  confirmBulkNoticeApproval() {
    const finalClear = () => {
      this.modalService.dismissAll();
      this.approveBulkId = null;
      this.approving = false;
      this.loadNotices();
    }

    this.approving = true;
    this.http
      .doGet(`assessment/approve_bulk_demand_notice/${this.approveBulkId}`)
      .subscribe(
        (res: IApproveRes) => {
          this.toastr.success(res.message, 'Completed');
          finalClear();
        },
        (err: any) => {
          this.toastr.error(err.message, 'Failed');
          finalClear();
        }        
      );
  }

  cancelBulkNoticeApproval() {
    this.confirmModal.close();
    this.toastr.info('Action cancelled!', 'Info');
    this.approveBulkId = null;
  }

  private loadNotices(url: string = null) {
    this.loading = true;
    const defaultUrl = `assessment/list_bulk_demand_notcies/${this.page}`;

    this.http.doGet(url || defaultUrl).subscribe(
      (res: INoticeRes) => {
        const loadedNotices: INotice[] = res.data.result || [];

        this.notices = loadedNotices.map((notice, index) => ({
          ...notice,
          sn: ++index,
        }));

        this.assessmentService.bulkDemandNotice.next(this.notices);
        this.nextPage = res.data.next_page;
        this.previousPage = res.data.previous_page;
        this.pageCount = res.data.page_count;
        this.perPageCount = res.data.per_page_count;
        this.resultCount = res.data.result_count;
        this.totalCount = res.data.total_count;
      },
      (err) => {
        // Toast error
        this.toastr.error(err.message, 'Error Loading.');
      },
      () => {
        this.searching = false;
        this.loading = false;
      }
    );
  }

  capitalise(words) {
    return words
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  public timeAgo(timestamp: number) {
    return Utils.getTimeIntervalPhpTimeStamp(timestamp);
  }
}
