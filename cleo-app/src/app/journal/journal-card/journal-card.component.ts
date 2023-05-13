import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Journal} from "../journal.type";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";

@Component({
  selector: 'app-journal-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './journal-card.component.html',
  styleUrls: ['./journal-card.component.scss']
})
export class JournalCardComponent {
  @Input() journal!: Journal;
  @Output() onDeleteJournal: EventEmitter<Journal> = new EventEmitter<Journal>();
  @Output() onEditJournal: EventEmitter<Journal> = new EventEmitter<Journal>();

  public editJournal() {
    this.onEditJournal.emit(this.journal);
  }

  public deleteJournal() {
    this.onDeleteJournal.emit(this.journal);
  }
}
