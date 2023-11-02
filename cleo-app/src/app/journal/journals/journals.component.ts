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
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";

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
  private dialog = inject(MatDialog);
  private sink = new SubSink();
  public journals$!: Observable<Journal[]>;

  private updateJournals() {
    this.journals$ = this.journalsService.journals$().pipe(delay(300));
  }

  public ngOnInit() {
    this.updateJournals();
  }

  public async navigateHome() {
    await this.router.navigate([HOME]);
  }

  public newJournal() {
    const dialogRef = this.dialog.open(NewJournalComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.sink.collect(
          this.journalsService.createJournal$(name)
            .subscribe(async (journal) => {
              if (!journal) return;
              await this.router.navigate([`journal/${journal._id}`]);
            })
        );
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
        this.sink.collect(
          this.journalsService.patchJournalName$(journal._id, name)
            .subscribe(async (success) => {
              // todo: give confirmation alert
              if (!success) return;
            })
        );
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
        this.sink.collect(
          this.journalsService.deleteJournal$(journal._id)
            .subscribe(async (success) => {
              // todo: give confirmation alert
              if (!success) return;
              this.updateJournals();
            })
        );
      }
    });
  }

  public logout() {
    this.sink.collect(
      this.userService.logout$().subscribe(async (success) => {
        if (!success) return;
        await this.router.navigate([HOME]);
      })
    );
  }

  public ngOnDestroy() {
    this.sink.drain();
  }
}
