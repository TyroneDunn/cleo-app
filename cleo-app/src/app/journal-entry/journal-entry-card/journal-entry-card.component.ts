import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalEntry} from "../journal-entry.type";

@Component({
  selector: 'app-journal-entry-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-entry-card.component.html',
  styleUrls: ['./journal-entry-card.component.scss']
})
export class JournalEntryCardComponent {
  @Input() journalEntry!: JournalEntry;
}
