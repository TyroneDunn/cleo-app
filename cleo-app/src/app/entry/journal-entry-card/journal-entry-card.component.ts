import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Entry} from "../entry.type";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {convert} from "html-to-text";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-entry-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './journal-entry-card.component.html',
  styleUrls: ['./journal-entry-card.component.scss']
})
export class JournalEntryCardComponent {
  @Input() journalEntry!: Entry;
  @Input() journalId!: string;
  @Output() onDeleteJournalEntry = new EventEmitter<Entry>()
  public parseEntryBody(entry: Entry): Observable<string> {
    return of(convert(entry.body));
  }

  public deleteJournalEntry() {
    this.onDeleteJournalEntry.emit(this.journalEntry);
  }
}
