import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {JournalEntry} from "../journal-entry.type";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JournalEntryService} from "../journal-entry.service";
import {SubSink} from "../../../utils/sub-sink";
import {MatInputModule} from "@angular/material/input";

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
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './journal-entry-detail.component.html',
  styleUrls: ['./journal-entry-detail.component.scss']
})
export class JournalEntryDetailComponent {
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private journalEntryService = inject(JournalEntryService);
  private route = inject(ActivatedRoute);
  private sink = new SubSink();
  public mode$ = new BehaviorSubject<Mode>("normal");
  public journalEntry$ = new BehaviorSubject<JournalEntry | undefined>(undefined);
  public entryForm: FormGroup = this.formBuilder.group({body: ['', Validators.required]});
  private journalId$ = new BehaviorSubject<string>('');
  private entryId$ = new BehaviorSubject<string>('');

  public ngOnInit() {
    this.sink.collect(
      this.route.paramMap.subscribe((params) => {
        this.journalId$.next(params.get('journalId') as string);
        this.entryId$.next(params.get('entryId') as string);

        this.sink.collect(
          this.journalEntryService.journalEntry$(this.journalId$.value, this.entryId$.value)
            .subscribe((journalEntry) => {
              if (!journalEntry) return;
              this.journalEntry$.next(journalEntry);
              if (journalEntry.body === 'New Entry') this.enterEditMode();
            })
        );
      })
    )
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

    if (this.entryForm.invalid)
      return;

    const body = this.entryForm.get('body')?.value as string;
    if (body === this.journalEntry$.value.body) {
      this.enterNormalMode();
      return;
    }

    this.sink.collect(
      this.journalEntryService.patchJournalEntry$(this.journalId$.value, this.entryId$.value, body)
        .subscribe((success) => {
          if (!success) return;
          this.updateEntry(body);
          this.enterNormalMode();
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

  public deleteEntry() {
    this.sink.collect(
      this.journalEntryService.deleteJournalEntry$(this.journalId$.value, this.entryId$.value)
        .subscribe((success) => {
          if (!success) return;
          this.navigateBack();
        })
    );
  }

  public ngOnDestroy() {
    this.mode$.unsubscribe();
    this.sink.drain();
  }
}
