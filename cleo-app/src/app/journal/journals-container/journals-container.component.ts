import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject} from "rxjs";
import {Journal, JournalSortOption} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {JournalHttpService} from "../journal-http.service";
import {JournalDetailComponent} from "../journal-detail/journal-detail.component";
import {
  JournalEntryDetailComponent
} from "../../journal-entry/journal-entry-detail/journal-entry-detail.component";
import {JournalCardComponent} from "../journal-card/journal-card.component";
import {Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {UserService} from "../../user/user.service";
import {HOME} from "../../app-routing.constants";
import {MatDialog} from "@angular/material/dialog";
import {NewJournalComponent} from "../new-journal/new-journal.component";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";
import {CreateJournalDTO, GetJournalsDTO} from "../journal-dtos";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateFilterComponent} from "../../date-filter/date-filter.component";
import {MatNativeDateModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-journals-container',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatGridListModule,
    MatListModule,
    JournalDetailComponent,
    JournalEntryDetailComponent,
    JournalCardComponent,
    RouterLink,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DateFilterComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './journals-container.component.html',
  styleUrls: ['./journals-container.component.scss']
})
export class JournalsContainerComponent {
  private journalsService = inject(JournalHttpService);
  private router = inject(Router);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  public searchForm: FormGroup = this.formBuilder.nonNullable.group({
    searchValue: ''
  });
  public journals: BehaviorSubject<Journal[]> = new BehaviorSubject<Journal[]>([]);
  public count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public pageIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public limit: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  public journalsDTO: BehaviorSubject<GetJournalsDTO> = new BehaviorSubject<GetJournalsDTO>({
    sort: 'lastUpdated',
    order: -1,
    page: 0,
    limit: 10,
  });
  public displayedColumns: string[] = ['name', 'dateCreated', 'lastUpdated'];

  public ngOnInit() {
    this.fetchJournals();
  }

  private fetchJournals() {
    this.journalsService.getJournals$(this.journalsDTO.value)
      .subscribe((getJournalsResponseDTO) => {
        this.count.next(getJournalsResponseDTO.count);
        this.journals.next(getJournalsResponseDTO.journals);
      });
  }

  public async navigateHome() {
    await this.router.navigate([HOME]);
  }

  public newJournal() {
    const dialogRef = this.dialog.open(NewJournalComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        const dto: CreateJournalDTO = {name: name};
        this.journalsService.createJournal$(dto)
          .subscribe(async () => {
            this.fetchJournals();
          })
      }
    });
  }

  public filterJournalsByDate() {
    const dialogRef = this.dialog.open(DateFilterComponent);
    dialogRef.afterClosed().subscribe((dateFilter) => {
      const dto = this.journalsDTO.value;
      if (dateFilter.dateRange.startDate || dateFilter.dateRange.endDate)
        this.journalsDTO.next(({
          ...dto.name && {name: dto.name},
          ...dto.nameRegex && {nameRegex: dto.nameRegex},
          ...dto.sort && {sort: dto.sort},
          ...dto.order && {order: dto.order},
          ...dateFilter.dateRange.startDate && {startDate: dateFilter.dateRange.startDate},
          ...dateFilter.dateRange.endDate && {endDate: dateFilter.dateRange.endDate},
          ...dto.page && {page: dto.page},
          ...dto.limit && {limit: dto.limit},
        }));
      else
        this.journalsDTO.next(({
          ...dto.name && {name: dto.name},
          ...dto.nameRegex && {nameRegex: dto.nameRegex},
          ...dto.sort && {sort: dto.sort},
          ...dto.order && {order: dto.order},
          ...dto.page && {page: dto.page},
          ...dto.limit && {limit: dto.limit},
        }));
      this.fetchJournals();
    });
  }

  public sortJournals($event: Sort): void {
    const dto = this.journalsDTO.value;
    this.journalsDTO.next(({
      ...dto.name && {name: dto.name},
      ...dto.nameRegex && {nameRegex: dto.nameRegex},
      sort: $event.active as JournalSortOption,
      order: $event.direction === 'asc'? 1:-1,
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...dto.page && {page: dto.page},
      ...dto.limit && {limit: dto.limit},
    }));
    this.fetchJournals();
  }

  public onSearchSubmit() {
    const dto = this.journalsDTO.value;
    this.journalsDTO.next(({
      ...dto.name && {name: dto.name},
      nameRegex: this.searchForm.value.searchValue,
      ...dto.sort && {sort: dto.sort},
      ...dto.order && {order: dto.order},
      ...dto.limit && {limit: dto.limit},
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...dto.page && {page: dto.page},
      ...dto.limit && {limit: dto.limit},
    }));
    this.fetchJournals();
  }

  public handlePageEvent($event: PageEvent) {
    const dto = this.journalsDTO.value;
    this.journalsDTO.next({
      ...dto.name && {name: dto.name},
      ...dto.nameRegex && {nameRegex: dto.nameRegex},
      ...dto.sort && {sort: dto.sort},
      ...dto.order && {order: dto.order},
      ...dto.startDate && {startDate: dto.startDate},
      ...dto.endDate && {endDate: dto.endDate},
      ...$event.pageIndex && {page: $event.pageIndex},
      ...$event.pageSize && {limit: $event.pageSize},
    });
    this.fetchJournals();
  }

  public editJournal(journal: Journal) {
    const config = {
      data: {journal: journal}
    }
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.journalsService.updateJournal$({id: journal._id.toString(), name})
          .subscribe(async (success) => {
            // todo: give confirmation alert
            if (!success) return;
          })
      }
    });
  }

  public deleteJournal(journal: Journal) {
    const config = {
      data: {journal: journal}
    }
    const dialogRef = this.dialog.open(DeleteJournalComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.journalsService.deleteJournal$(journal._id)
          .subscribe(async (success) => {
            // todo: give confirmation alert
            if (!success) return;
          })
      }
    });
  }

  public logout() {
    this.userService.logout$().subscribe(async (success) => {
      if (!success) return;
      await this.router.navigate([HOME]);
    });
  }
}
