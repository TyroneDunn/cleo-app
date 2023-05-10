import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalService} from "../journal.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Journal} from "../journal.type";
import {SubSink} from "../../../utils/sub-sink";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {JournalEntry} from "../../journal-entry/journal-entry.type";
import {JournalEntryService} from "../../journal-entry/journal-entry.service";
import {
  JournalEntryCardComponent
} from "../../journal-entry/journal-entry-card/journal-entry-card.component";

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    JournalEntryCardComponent
  ],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private journalService = inject(JournalService);
  private journalEntryService = inject(JournalEntryService);
  private route = inject(ActivatedRoute);
  private sink = new SubSink();
  private id$ = new BehaviorSubject<string>('');
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

  public ngOnDestroy() {
    this.id$.unsubscribe();
    this.journal$.unsubscribe();
    this.sink.drain();
  }
}
