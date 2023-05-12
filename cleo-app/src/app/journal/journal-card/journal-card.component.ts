import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Journal} from "../journal.type";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {DeleteJournalComponent} from "../delete-journal/delete-journal.component";
import {JournalService} from "../journal.service";
import {SubSink} from "../../../utils/sub-sink";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";

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
  public dialog = inject(MatDialog);
  private journalService = inject(JournalService);
  private sink = new SubSink();
  @Input() journal!: Journal;
  @Output() onDeleteJournal = new EventEmitter();

  public deleteJournal() {
    const dialogRef = this.dialog.open(DeleteJournalComponent, {
      data: {
        journal: this.journal,
      }
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.sink.collect(
          this.journalService.deleteJournal$(this.journal._id).subscribe((success) => {
            if (success)
              this.onDeleteJournal.emit();
          })
        );
      }
    });
  }

  public editJournal() {
    const dialogRef = this.dialog.open(EditJournalComponent, {
      data: {
        journal: this.journal,
      }
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.sink.collect(
          this.journalService.patchJournalName$(this.journal._id, name).subscribe()
        );
      }
    });
  }
}
