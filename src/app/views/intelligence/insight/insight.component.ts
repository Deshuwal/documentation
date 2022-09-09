import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { Utils } from 'src/app/shared/utils';
import { IntelligenceService } from '../intelligence.service';

interface IRegInsight {
  sn: number;
  id: number;
  name: string;
  role: number;
  source?: string;
  tags?: string;
  tin?: string;
  title?: string;
}

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.scss'],
  animations: [SharedAnimations],
})
export class InsightComponent implements OnInit {
  
  public insights: IRegInsight[] = [];
  public loading: boolean = false;
  public nextLoading: boolean = false;
  public searchLoading: boolean = false;
  public cache: Record<string, any> = {};
  public page: number = 1;
  public offset: number = 0;
  public nextPage: number;
  public pageCount: number;
  public perPageCount: number;
  public previousPage: number;
  public resultCount: number;
  public pageNumber: number;
  public totalCount: number;

  private userProfile: any;
  public filteredItems: any[] = [];

  public actionSelectOptions: any[] = [
    {
      title: 'Add Tags',
      key: 'addTags',
    },
    {
      title: 'Send Sms',
      key: 'sendSms',
    },
    {
      title: 'Send Email',
      key: 'sendEmail',
    },
  ];

  public actionDropdownConfig: any = {
    search: false,
    placeholder: 'Actions',
    displayKey: 'title'
  };

  @ViewChild('input', { static: false }) input: ElementRef;

  constructor(
    private http: HttpService,
    private breadcrumb: BreadcrumbService,
    private localStore: LocalStoreService,
    private intelligenceService: IntelligenceService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem('user');
    this.breadcrumb.setCrumbItem('regInsight');
    this.loadInsights();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          if(this.input.nativeElement.value.length < 1) {
            this.filteredItems = [];
            this.loadInsights();
            return;
          }

          this.loading = true;
          this.http
            .doGet(`insight/?tags=${this.input.nativeElement.value}`)
            .subscribe(
              (res: any) => {
                const insights: any = res.data.result || [];
                this.insights = insights.map((insight, index) => ({
                  ...insight,
                  tags: insight.tags.join(),
                  sn: ++index,
                }));
                this.filteredItems = this.insights;
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

  loadInsights() {
    this.loading = true;
    this.http.doGet(`insight`).subscribe(
      (res: any) => {
        const insights: any = res.data.result || [];
        this.insights = insights.map((insight, index) => ({
          ...insight,
          tags: insight.tags.join(),
          sn: ++index,
        }));

        this.intelligenceService.insight.next(this.insights);

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
      }
    );
  }

  onPageChange(pg: any) {
    // console.log(pg);

    if(this.offset == pg.offset) {
      return;
    }
    
    this.offset = pg.offset;
    this.page = this.offset + 1;

    let url = `insight/${this.page}`;

    if(this.input.nativeElement.value.length) {
      url = `insight/${this.page}?tags=${this.input.nativeElement.value}`;
    }

    this.nextLoading = true;
    // this.insights = [];

    this.http.doGet(url).subscribe(
      (res: any) => {
        const insights: any = res.data.result || [];
        this.insights = insights.map((insight, index) => ({ ...insight, tags: insight.tags.join(), sn: ++index }));

        this.intelligenceService.insight.next(this.insights);

        this.nextPage = res.data.next_page;
        this.previousPage = res.data.previous_page;
        this.pageCount = res.data.page_count;
        this.perPageCount = res.data.per_page_count;
        this.resultCount = res.data.result_count;
        this.totalCount = res.data.total_count;

        this.nextLoading = false;
      },
      (err) => {
        this.nextLoading = false;
      }
    );
  }

  insightActionSelected(action: any) {
    // console.log('Insight action', action);
  }

  capitalise(words) {
    return words
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  timeAgo(timestamp: any) {
    const seconds = Math.floor(new Date(timestamp).getTime() / 1000);
    return Utils.getTimeIntervalPhpTimeStamp(seconds);
  }
}
