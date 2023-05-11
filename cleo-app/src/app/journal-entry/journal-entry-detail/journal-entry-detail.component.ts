import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {JournalEntry} from "../journal-entry.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JournalEntryService} from "../journal-entry.service";
import {SubSink} from "../../../utils/sub-sink";

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
    RouterLink
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

  public enterEditMode() {
    this.mode$.next("edit");
  }

  public deleteJournalEntry() {
    this.sink.collect(
      this.journalEntryService.deleteJournalEntry$(this.journalId$.value, this.entryId$.value)
        .subscribe((success) => {
          if (!success) return;
          this.navigateBack();
        })
    );
  }

  public cancelEditing() {
    this.mode$.next("normal");
  }

  public doneEditing() {

  }

  public ngOnDestroy() {
    this.mode$.unsubscribe();
    this.sink.drain();
  }
}
