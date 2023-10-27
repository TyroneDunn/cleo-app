import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
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
  ],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private journalService = inject(JournalHttpService);
  private entryService = inject(EntryHttpService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private journalID$ = new BehaviorSubject<string>('');
  public journal$ = new BehaviorSubject<Journal | undefined>(undefined);
  public entries$ = new BehaviorSubject<Entry[]>([]) ;
  public count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public entriesDTO$: BehaviorSubject<GetEntriesDTO> = new BehaviorSubject<GetEntriesDTO>({
    journal: '',
    sort: 'lastUpdated',
    order: -1,
    page: 0,
    limit: 10,
  });
  public searchForm: FormGroup = this.formBuilder.nonNullable.group({
    searchValue: ''
  });
  public displayedColumns: string[] = ['body', 'lastUpdated', 'actions'];

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.journalID$.next(params['id'] as string);
      const dto = this.entriesDTO$.value;
      this.entriesDTO$.next({
        ...dto.bodyRegex && {name: dto.bodyRegex},
        journal: this.journalID$.value,
        ...dto.sort && {sort: dto.sort},
        ...dto.order && {order: dto.order},
        ...dto.startDate && {startDate: dto.startDate},
        ...dto.endDate && {endDate: dto.endDate},
        ...(dto.page!== undefined) && {page: dto.page},
        ...(dto.limit !== undefined) && {limit: dto.limit},
      });
      this.fetchJournal();
      this.fetchEntries();


      this.searchForm.valueChanges
        .pipe(debounceTime(300))
        .subscribe(query => {
          const dto = this.entriesDTO$.value;
          this.entriesDTO$.next({
            journal: dto.journal,
            bodyRegex: this.searchForm.value.searchValue,
            ...dto.sort && {sort: dto.sort},
            ...dto.order && {order: dto.order},
            ...dto.startDate && {startDate: dto.startDate},
            ...dto.endDate && {endDate: dto.endDate},
            ...dto.page && {page: dto.page},
            ...dto.limit && {limit: dto.limit},
          });
          this.fetchEntries();
        });
    })
  }

  private fetchJournal(): void {
    this.journalService.getJournal$(this.journalID$.value)
      .subscribe((journal) => {
        if (!journal) return;
        this.journal$.next(journal);
      });
  }

  private fetchEntries(): void {
    this.entryService.journalEntries$(this.entriesDTO$.value)
      .subscribe((dto) => {
        this.count.next(dto.count);
        this.entries$.next(dto.items);
      })
  }

  public navigateBack(): void {
    this.location.back();
  }

  public async navigateToEntry(entry: Entry): Promise<void> {
    await this.router.navigate([`entries/${entry._id}`])
  }

  public handleSortEntries($event: Sort): void {
    const dto = this.entriesDTO$.value;
    this.entriesDTO$.next({
      journal: dto.journal,
      ...dto.bodyRegex && {name: dto.bodyRegex},
      sort: $event.active as EntrySortOption,
      order: $event.direction === 'asc'? 1:-1,
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...dto.page && {page: dto.page},
      ...dto.limit && {limit: dto.limit},
    });
    this.fetchEntries();
  }

  public handleFilterEntriesByDate(): void {
    const dialogRef = this.dialog.open(DateFilterComponent);
    dialogRef.afterClosed().subscribe((dateFilter) => {
      const dto = this.entriesDTO$.value;
      if (dateFilter.dateRange.startDate || dateFilter.dateRange.endDate)
        this.entriesDTO$.next(({
          ...dto.bodyRegex && {name: dto.bodyRegex},
          journal: dto.journal,
          ...dto.sort && {sort: dto.sort},
          ...dto.order && {order: dto.order},
          ...dateFilter.dateRange.startDate && {startDate: dateFilter.dateRange.startDate},
          ...dateFilter.dateRange.endDate && {endDate: dateFilter.dateRange.endDate},
          ...dto.page && {page: dto.page},
          ...dto.limit && {limit: dto.limit},
        }));
      else
        this.entriesDTO$.next(({
          ...dto.bodyRegex && {name: dto.bodyRegex},
          journal: dto.journal,
          ...dto.sort && {sort: dto.sort},
          ...dto.order && {order: dto.order},
          ...dto.page && {page: dto.page},
          ...dto.limit && {limit: dto.limit},
        }));
      this.fetchEntries();
    });
  }

  public handleOnSearchSubmit(): void {
    const dto = this.entriesDTO$.value;
    this.entriesDTO$.next({
      journal: dto.journal,
      bodyRegex: this.searchForm.value.searchValue,
      ...dto.sort && {sort: dto.sort},
      ...dto.order && {order: dto.order},
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...dto.page && {page: dto.page},
      ...dto.limit && {limit: dto.limit},
    });
    this.fetchEntries();
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
    }
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && this.journal$.value) {
        this.journalService.updateJournal$({id: this.journal$.value._id, name: name})
          .subscribe(async (success) => {
            if (!success) return;
          });
      }
    });
  }

  public handleDeleteJournal() {
    const config = {
      data: {journal: this.journal$.value}
    }
    const dialogRef = this.dialog.open(DeleteJournalComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm && this.journal$.value) {
        this.journalService.deleteJournal$(this.journal$.value._id)
          .subscribe(async (success) => {
            if (!success) return;
            this.navigateBack();
          });
      }
    });
  }

  public handleDeleteEntry(journalEntry: Entry) {
    const journalId = this.journal$.value?._id as string;
    const config = {
      data: {journalEntry: journalEntry}
    }
    const dialogRef = this.dialog.open(DeleteEntryComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;
      this.entryService.deleteJournalEntry$(journalId, journalEntry._id)
        .subscribe((success) => {
          if (success) this.fetchEntries()
        });
    });
  }

  public handlePageEvent($event: PageEvent): void {
    const dto = this.entriesDTO$.value;
    this.entriesDTO$.next({
      journal: dto.journal,
      ...dto.bodyRegex && {nameRegex: dto.bodyRegex},
      ...dto.sort && {sort: dto.sort},
      ...dto.order && {order: dto.order},
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...$event.pageIndex && {page: $event.pageIndex},
      ...$event.pageSize && {limit: $event.pageSize},
    });
    this.fetchEntries();
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
