import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Entry} from "../entry.type";
import {JournalEntryService} from "../journal-entry.service";
import {SubSink} from "../../../utils/sub-sink";
import {MatInputModule} from "@angular/material/input";
import {DeleteJournalEntryComponent}
  from "../delete-journal-entry/delete-journal-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {QuillEditorComponent} from "ngx-quill";
import {FormsModule} from "@angular/forms";

type Mode = 'normal' | 'edit';

@Component({
  selector: 'app-journal-entry-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatInputModule,
    MatCardModule,
    QuillEditorComponent,
    FormsModule,
  ],
  templateUrl: './journal-entry-detail.component.html',
  styleUrls: ['./journal-entry-detail.component.scss']
})
export class JournalEntryDetailComponent {
  private location = inject(Location);
  private journalEntryService = inject(JournalEntryService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private sink = new SubSink();
  public mode$ = new BehaviorSubject<Mode>("normal");
  public journalEntry$ = new BehaviorSubject<Entry | undefined>(undefined);
  private journalId$ = new BehaviorSubject<string>('');
  private entryId$ = new BehaviorSubject<string>('');

  public ngOnInit() {
    this.sink.collect(
      this.route.paramMap.subscribe((params) => {
        this.entryId$.next(params.get('id') as string);
        this.updateJournalEntry();
      })
    )
  }

  private updateJournalEntry() {
    this.sink.collect(
      this.journalEntryService.journalEntry$(this.journalId$.value, this.entryId$.value)
        .subscribe((journalEntry) => {
          if (!journalEntry) return;
          this.journalEntry$.next(journalEntry);
          if (journalEntry.body === ' ') this.enterEditMode();
        })
    );
  }

  private updateEntry(body: string) {
    if (this.journalEntry$.value) {
      let entry = this.journalEntry$.value;
      entry.body = body;
      this.journalEntry$.next(entry);
    }
  }

  public navigateBack() {
    this.location.back();
  }

  private enterNormalMode() {
    this.mode$.next("normal");
  }

  public enterEditMode() {
    this.mode$.next("edit");
  }

  public cancelEditing() {
    this.mode$.next("normal");
  }

  public doneEditing() {
    if (!this.journalEntry$.value)
      return;

    const body = this.journalEntry$.value?.body as string;

    this.sink.collect(
      this.journalEntryService.patchJournalEntry$(this.journalId$.value, this.entryId$.value, body)
        .subscribe((success) => {
          if (!success) return;
          this.updateEntry(body);
          this.enterNormalMode();
        })
    );
  }

  public deleteEntry() {
    const config = {
      data: {journalEntry: this.journalEntry$.value}
    }
    const dialogRef = this.dialog.open(DeleteJournalEntryComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;

      if (this.journalEntry$.value) {
        this.sink.collect(
          this.journalEntryService.deleteJournalEntry$(this.journalId$.value, this.journalEntry$.value._id)
            .subscribe((success) => {
              if (success) this.navigateBack();
            })
        );
      }
    });
  }

  public ngOnDestroy() {
    this.mode$.unsubscribe();
    this.sink.drain();
  }
}
