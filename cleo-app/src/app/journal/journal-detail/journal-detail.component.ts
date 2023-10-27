import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalHttpService} from "../journal-http.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BehaviorSubject, debounceTime} from "rxjs";
import {Journal} from "../journal.type";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {Entry, EntrySortOption} from "../../entry/entry.type";
import {EntryHttpService} from "../../entry/entry-http.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";
import {DeleteEntryComponent} from "../../entry/delete-entry/delete-entry.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateFilterComponent} from "../../date-filter/date-filter.component";
import {GetEntriesDTO} from 'src/app/entry/entry-dtos';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {convert} from "html-to-text";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private journalService = inject(JournalHttpService);
  private entryService = inject(EntryHttpService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private journalID$ = new BehaviorSubject<string>('');
  public journal$ = new BehaviorSubject<Journal | undefined>(undefined);
  public entries$ = new BehaviorSubject<Entry[]>([]) ;
  public count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private defaultQueryParams = {
    page: 0,
    limit: 10,
  };
  public searchForm: FormGroup = this.formBuilder.nonNullable.group({
    searchValue: ''
  });
  public displayedColumns: string[] = ['body', 'lastUpdated', 'actions'];
  public page!: BehaviorSubject<number>;
  public limit!: BehaviorSubject<number>;

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.journalID$.next(params['id'] as string);
      this.fetchJournal(this.journalID$.value);
      this.route.queryParams.subscribe(queryParams => {
        if (Object.keys(queryParams).length === 0)
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: this.defaultQueryParams,
              queryParamsHandling: "merge",
            },
          );
        else {
          this.fetchEntries(this.journalID$.value, queryParams as GetEntriesDTO);
          this.page = new BehaviorSubject<number>((queryParams as GetEntriesDTO).page || 0);
          this.limit = new BehaviorSubject<number>((queryParams as GetEntriesDTO).limit || 10);
        }
      });
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {'bodyRegex': query.searchValue},
            queryParamsHandling: "merge",
          },
        );
      });
  }

  private fetchJournal(id: string): void {
    this.journalService.getJournal$(id)
      .subscribe((journal) => {
        if (!journal) return;
        this.journal$.next(journal);
      });
  }

  private fetchEntries(journalID: string, dto: GetEntriesDTO): void {
    this.entryService.journalEntries$({...dto, journal: journalID})
      .subscribe((response) => {
        this.count.next(response.count);
        this.entries$.next(response.items);
      })
  }

  public navigateBack(): void {
    this.router.navigate(['/journals']);
  }

  public async navigateToEntry(entry: Entry): Promise<void> {
    await this.router.navigate([`entries/${entry._id}`])
  }

  public handleSortEntries($event: Sort): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          sort: $event.active as EntrySortOption,
          order: $event.direction === 'asc'? 1:-1,
        },
        queryParamsHandling: "merge",
      },
    );
  }

  public handleFilterEntriesByDate(): void {
    const dialogRef = this.dialog.open(DateFilterComponent);
    dialogRef.afterClosed().subscribe((dateFilter) => {
      if (dateFilter.dateRange.startDate || dateFilter.dateRange.endDate)
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {
              ...dateFilter.dateRange.startDate && {startDate: dateFilter.dateRange.startDate},
              ...dateFilter.dateRange.endDate && {endDate: dateFilter.dateRange.endDate},
            },
            queryParamsHandling: "merge",
          },
        );
      else
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {
              startDate: undefined,
              endDate: undefined,
            },
            queryParamsHandling: "merge",
          },
        );
    });
  }

  public handleOnSearchSubmit(): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {'bodyRegex': this.searchForm.value.searchValue},
        queryParamsHandling: "merge",
      },
    );
  }

  public handlePageEvent($event: PageEvent): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          ...$event.pageIndex !== undefined && {page: $event.pageIndex},
          ...$event.pageSize !== undefined && {limit: $event.pageSize},
        },
        queryParamsHandling: "merge",
      },
    );
  }

  public handleCreateEntry() {
    this.entryService.createJournalEntry$(this.journalID$.value, '')
      .subscribe(async (journalEntry) => {
        if (!journalEntry) return;
        await this.router.navigate([`entries/${journalEntry._id}`]);
      })
  }

  public handleRenameJournal() {
    const config = {
      data: {journal: this.journal$.value}
    };
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && this.journal$.value) {
        this.journalService.updateJournal$({id: this.journalID$.value, name: name})
          .subscribe(async (success) => {
            if (success)
              this.notify(`Renamed to '${name}'.`);
          });
      }
    });
  }

  public handleDeleteJournal() {
    const config = {
      data: {journal: this.journal$.value}
    };
    const dialogRef = this.dialog.open(DeleteJournalComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.journalService.deleteJournal$(this.journalID$.value)
          .subscribe(async (success) => {
            if (success) {
              this.notify(`'${this.journal$.value?.name}' deleted.`);
              this.navigateBack();
            }
          });
      }
    });
  }

  public handleDeleteEntry(entry: Entry) {
    const config = {
      data: {journalEntry: entry}
    };
    const dialogRef = this.dialog.open(DeleteEntryComponent, config);
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.entryService.deleteJournalEntry$(entry._id)
        .subscribe((success) => {
          if (success) {
            this.notify('Entry deleted.');
            this.fetchEntries(this.journalID$.value, this.route.snapshot.queryParams as GetEntriesDTO)
          }
        });
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, '×', {
      duration: 3000,
      horizontalPosition: "left",
      verticalPosition: "bottom",
    });
  }

  public convertToPlainText(body: string): string {
    const html = document.createElement('div');
    html.innerHTML = body;
    return convert(html.outerHTML);
  }

  public ngOnDestroy(): void {
    this.journalID$.unsubscribe();
    this.journal$.unsubscribe();
  }
}
