import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Journal} from "../journal.type";

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
@Input() journal!: Journal;
}
