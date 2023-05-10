import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
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
    MatToolbarModule
  ],
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  private journalsService = inject(JournalService);
  private router = inject(Router);
  private sink = new SubSink();
  public journals$!: Observable<Journal[]>;

  public ngOnInit() {
    this.journals$ = this.journalsService.journals$();
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

  public ngOnDestroy() {
    this.sink.drain();
  }
}
