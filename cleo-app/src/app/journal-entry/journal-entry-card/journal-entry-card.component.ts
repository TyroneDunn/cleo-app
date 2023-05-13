import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalEntry} from "../journal-entry.type";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";

@Component({
  selector: 'app-journal-entry-card',
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
  @Input() journalEntry!: JournalEntry;
  @Input() journalId!: string;
  @Output() onDeleteJournalEntry = new EventEmitter<JournalEntry>()

  public deleteJournalEntry() {
    this.onDeleteJournalEntry.emit(this.journalEntry);
  }
}
