import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, delay, Observable} from "rxjs";
import {Journal} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {JournalHttpService} from "../journal-http.service";
import {JournalDetailComponent}
  from "../journal-detail/journal-detail.component";
import {JournalEntryDetailComponent}
  from "../../journal-entry/journal-entry-detail/journal-entry-detail.component";
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
import {GetJournalsDTO} from "../journal-dtos";

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
    MatMenuModule
  ],
  templateUrl: './journals-container.component.html',
  styleUrls: ['./journals-container.component.scss']
})
export class JournalsContainerComponent {
  private journalsService = inject(JournalHttpService);
  private router = inject(Router);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  public journals$!: Observable<Journal[]>;
  public getJournalsDTO: BehaviorSubject<GetJournalsDTO> = new BehaviorSubject<GetJournalsDTO>({});

  private updateJournals(dto: GetJournalsDTO) {
    this.journals$ = this.journalsService.journals$(dto)
      .pipe(delay(300));
  }

  public ngOnInit() {
    this.updateJournals({});
  }

  public async navigateHome() {
    await this.router.navigate([HOME]);
  }

  public newJournal() {
    const dialogRef = this.dialog.open(NewJournalComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.journalsService.createJournal$(name)
          .subscribe(async (journal) => {
            if (!journal) return;
            await this.router.navigate([`journal/${journal._id}`]);
          })
      }
    });
  }

  public editJournal(journal: Journal) {
    const config = {
      data: {journal: journal}
    }
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.journalsService.patchJournalName$(journal._id, name)
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
            this.updateJournals();
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
