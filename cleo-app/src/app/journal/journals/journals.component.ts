import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {Journal} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {JournalService} from "../journal.service";
import {JournalDetailComponent} from "../journal-detail/journal-detail.component";
import {
  JournalEntryDetailComponent
} from "../../journal-entry/journal-entry-detail/journal-entry-detail.component";
import {JournalCardComponent} from "../journal-card/journal-card.component";

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
    JournalCardComponent
  ],
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  private journalsService = inject(JournalService);
  public journals$!: Observable<Journal[]>;

  public ngOnInit() {
    this.journals$ = this.journalsService.journals$();
  }
}
