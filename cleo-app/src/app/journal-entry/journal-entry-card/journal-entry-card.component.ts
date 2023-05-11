import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalEntry} from "../journal-entry.type";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-journal-entry-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './journal-entry-card.component.html',
  styleUrls: ['./journal-entry-card.component.scss']
})
export class JournalEntryCardComponent {
  @Input() journalEntry!: JournalEntry;
  @Input() journalId!: string;
}
