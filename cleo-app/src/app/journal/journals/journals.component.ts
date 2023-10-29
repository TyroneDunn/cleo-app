import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, debounceTime} from "rxjs";
import {Journal, JournalSortOption} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {JournalHttpService} from "../journal-http.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {UserService} from "../../user/user.service";
import {MatDialog} from "@angular/material/dialog";
import {NewJournalComponent} from "../new-journal/new-journal.component";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";
import {CreateJournalDTO, GetJournalsDTO} from "../journal-dtos";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateFilterComponent} from "../../date-filter/date-filter.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {APP_HOME} from "../../../environments/constants";

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    RouterLink,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DateFilterComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  private journalsService = inject(JournalHttpService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private defaultQueryParams = {
    page: 0,
    limit: 10,
  };
  public searchForm: FormGroup = this.formBuilder.nonNullable.group({
    searchValue: ''
  });
  public journals: BehaviorSubject<Journal[]> = new BehaviorSubject<Journal[]>([]);
  public count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public displayedColumns: string[] = ['name', 'dateCreated', 'lastUpdated', 'actions'];
  public page!: BehaviorSubject<number>;
  public limit!: BehaviorSubject<number>;
  public filterIsActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  public ngOnInit(): void {
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
        this.fetchJournals(queryParams as GetJournalsDTO);
        this.page = new BehaviorSubject<number>((queryParams as GetJournalsDTO).page || 0);
        this.limit = new BehaviorSubject<number>((queryParams as GetJournalsDTO).limit || 10);
        if ((queryParams as GetJournalsDTO).startDate || (queryParams as GetJournalsDTO).endDate)
          this.filterIsActive.next(true);
        else
          this.filterIsActive.next(false);
      }
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {'nameRegex': query.searchValue},
            queryParamsHandling: "merge",
          },
        );
      });
  }

  private fetchJournals(dto: GetJournalsDTO): void {
    this.journalsService.getJournals$(dto)
      .subscribe((getJournalsResponseDTO) => {
        this.count.next(getJournalsResponseDTO.count);
        this.journals.next(getJournalsResponseDTO.items);
      });
  }

  public async navigateHome(): Promise<void> {
    await this.router.navigate([APP_HOME]);
  }

  public async navigateToJournal(journal: Journal): Promise<void> {
    await this.router.navigate([`journals/${journal._id}`])
  }

  public handleFilterJournalsByDate(): void {
    const params = this.route.snapshot.queryParams as GetJournalsDTO;
    const config = {
      data: {
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
      }
    };
    const dialogRef = this.dialog.open(DateFilterComponent, config);
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

  public handleSortJournals($event: Sort): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          sort: $event.active as JournalSortOption,
          order: $event.direction === 'asc'? 1:-1,
        },
        queryParamsHandling: "merge",
      },
    );
  }

  public handleSearchSubmit(): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {'nameRegex': this.searchForm.value.searchValue},
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

  public handleNewJournal(): void {
    const dialogRef = this.dialog.open(NewJournalComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        const dto: CreateJournalDTO = {name: name};
        this.journalsService.createJournal$(dto)
          .subscribe(async () => {
            this.notify(`'${name}' created.`)
            this.fetchJournals(this.route.snapshot.queryParams);
          })
      }
    });
  }

  public handleRenameJournal(journal: Journal): void {
    const config = {
      data: {journal: journal}
    }
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.journalsService.updateJournal$({id: journal._id.toString(), name})
          .subscribe(async (success) => {
            this.notify(`Renamed to '${name}'.`);
            this.fetchJournals(this.route.snapshot.queryParams);
            if (!success) return;
          })
      }
    });
  }

  public handleDeleteJournal(journal: Journal): void {
    const config = {
      data: {journal: journal}
    }
    const dialogRef = this.dialog.open(DeleteJournalComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.journalsService.deleteJournal$(journal._id)
          .subscribe(async (success) => {
            if (success) {
              this.notify(`'${journal.name}' deleted.`);
              this.fetchJournals(this.route.snapshot.queryParams);
            }
          })
      }
    });
  }

  public handleLogout(): void {
    this.userService.logout$().subscribe(async (success) => {
      if (!success) return;
      await this.router.navigate([APP_HOME]);
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, '×', {
      duration: 3000,
      horizontalPosition: "left",
      verticalPosition: "bottom",
    });
  }
}
