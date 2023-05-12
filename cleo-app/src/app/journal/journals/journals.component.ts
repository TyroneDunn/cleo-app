import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {delay, Observable} from "rxjs";
import {Journal} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {JournalService} from "../journal.service";
import {JournalDetailComponent}
  from "../journal-detail/journal-detail.component";
import {JournalEntryDetailComponent}
  from "../../journal-entry/journal-entry-detail/journal-entry-detail.component";
import {JournalCardComponent} from "../journal-card/journal-card.component";
import {Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {SubSink} from "../../../utils/sub-sink";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {UserService} from "../../user/user.service";
import {HOME} from "../../app-routing.constants";
import {MatDialog} from "@angular/material/dialog";
import {NewJournalComponent} from "../new-journal/new-journal.component";

const NEW_JOURNAL_PLACEHOLDER = 'New Journal';

@Component({
  selector: 'app-journals',
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
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  private journalsService = inject(JournalService);
  private router = inject(Router);
  private userService = inject(UserService);
  private newJournalDialog = inject(MatDialog);
  private sink = new SubSink();
  public journals$!: Observable<Journal[]>;

  private updateJournals() {
    this.journals$ = this.journalsService.journals$().pipe(delay(300));
  }

  public ngOnInit() {
    this.updateJournals();
  }

  public newJournal() {
    this.sink.collect(
      this.journalsService.createJournal$(NEW_JOURNAL_PLACEHOLDER)
        .subscribe(async (journal) => {
          if (!journal) return;
          await this.router.navigate([`journal/${journal._id}`]);
        })
    );
  }

  public logout() {
    this.sink.collect(
      this.userService.logout$().subscribe(async (success) => {
        if (!success) return;
        await this.router.navigate([HOME]);
      })
    );
  }

  public async navigateHome() {
    await this.router.navigate([HOME]);
  }

  public openNewJournalDialog() {
    const dialogRef = this.newJournalDialog.open(NewJournalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public handleOnDeleteJournal() {
    this.updateJournals();
  }

  public ngOnDestroy() {
    this.sink.drain();
  }
}
