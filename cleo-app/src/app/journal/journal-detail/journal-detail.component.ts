import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {JournalService} from "../journal.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Journal} from "../journal.type";
import {SubSink} from "../../../utils/sub-sink";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {JournalEntry} from "../../journal-entry/journal-entry.type";
import {JournalEntryService} from "../../journal-entry/journal-entry.service";
import {JournalEntryCardComponent}
  from "../../journal-entry/journal-entry-card/journal-entry-card.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    JournalEntryCardComponent,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatInputModule,
  ],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private journalService = inject(JournalService);
  private journalEntryService = inject(JournalEntryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private dialog = inject(MatDialog);
  private sink = new SubSink();
  private id$ = new BehaviorSubject<string>('');
  public journal$ = new BehaviorSubject<Journal | undefined>(undefined);
  public journalEntries$ = new BehaviorSubject<JournalEntry[] | undefined>(undefined) ;

  public ngOnInit() {
    this.sink.collect(
      this.route.paramMap.subscribe(params => {
        this.id$.next(params.get('id') as string);

        this.sink.collect(
          this.journalService.journal$(this.id$.value).subscribe((journal) => {
            if (!journal) return;
            this.journal$.next(journal);
          })
        );

        this.sink.collect(
          this.journalEntryService.journalEntries$(this.id$.value).subscribe((entries) => {
            this.journalEntries$.next(entries);
          })
        );
      })
    );
  }

  public navigateBack() {
    this.location.back();
  }

  public newEntry() {
    this.sink.collect(
      this.journalEntryService.createJournalEntry$(this.id$.value, 'New Entry')
        .subscribe(async (journalEntry) => {
          if (!journalEntry) return;
          await this.router.navigate([`journal/${this.journal$.value?._id}/journal-entry/${journalEntry._id}`]);
        })
    );
  }

  public editJournal() {
    const config = {
      data: {journal: this.journal$.value}
    }
    const dialogRef = this.dialog.open(EditJournalComponent, config);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && this.journal$.value) {
        this.sink.collect(
          this.journalService.patchJournalName$(this.journal$.value._id, name)
            .subscribe(async (success) => {
              if (!success) return;
            })
        );
      }
    });
  }

  public deleteJournal() {
    const config = {
      data: {journal: this.journal$.value}
    }
    const dialogRef = this.dialog.open(DeleteJournalComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm && this.journal$.value) {
        this.sink.collect(
          this.journalService.deleteJournal$(this.journal$.value._id)
            .subscribe(async (success) => {
              if (!success) return;
              this.navigateBack();
            })
        );
      }
    });
  }

  public deleteJournalEntry(journalEntry: JournalEntry) {
    const journalId = this.journal$.value?._id as string;
    const config = {
      data: {journalEntry: journalEntry}
    }
    const dialogRef = this.dialog.open(DeleteJournalEntryComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;
      this.sink.collect(
        this.journalEntryService.deleteJournalEntry$(journalId, journalEntry._id)
          .subscribe((success) => {
            if (success) this.updateJournalEntries()
          })
      );
    });
  }

  public ngOnDestroy() {
    this.id$.unsubscribe();
    this.journal$.unsubscribe();
    this.sink.drain();
  }
}
