import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from "rxjs/operators";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { HttpService } from "src/app/shared/services/http.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { Utils } from "src/app/shared/utils";

@Component({
  selector: "app-audited-list",
  templateUrl: "./audited-list.component.html",
  styleUrls: ["./audited-list.component.scss"],
  animations: [SharedAnimations],
})
export class AuditedListComponent implements OnInit {
  activities: any[];
  loading: boolean = false;
  searchLoading: boolean = false;
  cache: Record<string, any> = {};

  userProfile: any;
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

  @ViewChild("input", { static: false }) input: ElementRef;

  constructor(
    private http: HttpService,
    private breadcrumb: BreadcrumbService,
    private localStore: LocalStoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");
    this.loadActivities();
    this.breadcrumb.setCrumbItem("adl");
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.http
            .doGet(`audit/activities/?user=${this.input.nativeElement.value}`)
            .subscribe(
              (res: any) => {
                const loadedAct: any = res.data.result || [];
                this.activities = [
                  {
                    sn: 1,
                    name: "Preston University",
                    tin: 8765337893,
                    address: "12 Ebimpejo Lane Idumota, Lagos",
                    industry: "Education ",
                    score: 3.2,
                    amount: 6900,
                    dueDate: new Date(),
                  },
                  {
                    sn: 2,
                    name: "Mtn Nigeri Limited",
                    tin: 8765337893,
                    address: "12 Rwang PaneLane, Jos Plateau State",
                    industry: "Teleciommunication ",
                    score: 7.2,
                    amount: 87666,
                    dueDate: new Date(),
                  },
                ];
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

  loadActivities() {
    this.loading = true;
    this.http.doGet(`audit/activities`).subscribe(
      (res: any) => {
        this.activities = [
          {
            sn: 1,
            name: "Preston University",
            tin: 8765337893,
            address: "12 Ebimpejo Lane Idumota, Lagos",
            industry: "Education ",
            score: 3.2,
            amount: 6900,
            dueDate: new Date(),
          },
          {
            sn: 2,
            name: "Mtn Nigeri Limited",
            tin: 8765337893,
            address: "12 Rwang PaneLane, Jos Plateau State",
            industry: "Teleciommunication ",
            score: 7.2,
            amount: 87666,
            dueDate: new Date(),
          },
        ];

        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  onPageChange(pg: any) {
    // console.log(pg);
    if (this.offset == pg.offset) {
      return;
    }

    this.loading = true;

    this.offset = pg.offset;
    this.page = this.offset + 1;

    this.http.doGet(`audit/activities/${this.page}`).subscribe(
      (res: any) => {
        this.activities = [
          {
            sn: 1,
            name: "Preston University",
            tin: 8765337893,
            address: "12 Ebimpejo Lane Idumota, Lagos",
            industry: "Education ",
            score: 3.2,
            amount: 6900,
            dueDate: new Date(),
          },
          {
            sn: 2,
            name: "Mtn Nigeri Limited",
            tin: 8765337893,
            address: "12 Rwang PaneLane, Jos Plateau State",
            industry: "Teleciommunication ",
            score: 7.2,
            amount: 87666,
            dueDate: new Date(),
          },
        ];

        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  capitalise(words) {
    return words
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  timeAgo(timestamp: any) {
    const seconds = Math.floor(new Date(timestamp).getTime() / 1000);
    return Utils.getTimeIntervalPhpTimeStamp(seconds);
  }
}
