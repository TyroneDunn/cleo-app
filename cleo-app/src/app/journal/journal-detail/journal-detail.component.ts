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
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

type State = 'normal' | 'edit';

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
    ReactiveFormsModule,
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
  private formBuilder = inject(FormBuilder);
  public nameForm = this.formBuilder.group({name: ['', Validators.required]});
  private sink = new SubSink();
  private id$ = new BehaviorSubject<string>('');
  public state$ = new BehaviorSubject<State>("normal");
  public journal$ = new BehaviorSubject<Journal | undefined>(undefined);
  public journalEntries$ = new BehaviorSubject<JournalEntry[] | undefined>(undefined) ;

  ngOnInit() {
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

  public newEntry() {
    this.sink.collect(
      this.journalEntryService.createJournalEntry$(this.id$.value, 'New Entry.')
        .subscribe(async (journalEntry) => {
          if (!journalEntry) return;
          await this.router.navigate([`journal-entry/${journalEntry._id}`]);
        })
    );
  }

  public navigateBack() {
    this.location.back();
  }

  public deleteJournal() {
    this.sink.collect(
      this.journalService.deleteJournal$(this.id$.value)
        .subscribe((success) => {
          if (!success) return;
          this.navigateBack();
        })
    );
  }

  public enterEditMode() {
    this.state$.next("edit");
  }

  public doneEditing() {
    if (!this.journal$.value)
      return;

    const name = this.nameForm.get('name')?.value as string;
    if (name === this.journal$.value.name) {
      this.state$.next("normal");
      return;
    }

    this.sink.collect(
      this.journalService.patchJournalName$(this.id$.value, name).subscribe((success) => {
        if (!success) return;
        this.updateJournalName(name);
        this.state$.next("normal");
      })
    );
  }

  private updateJournalName(name: string) {
    if (this.journal$.value) {
      let journal = this.journal$.value;
      journal.name = name;
      this.journal$.next(journal);
    }
  }

  public ngOnDestroy() {
    this.state$.unsubscribe();
    this.id$.unsubscribe();
    this.journal$.unsubscribe();
    this.sink.drain();
  }
}
