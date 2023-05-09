import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Journal} from "../journal.type";

@Component({
  selector: 'app-journal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-card.component.html',
  styleUrls: ['./journal-card.component.scss']
})
export class JournalCardComponent {
  @Input() journal!: Journal;
}
