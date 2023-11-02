import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {JournalEntry} from "../journal-entry.type";

interface DialogData {
  journalEntry: JournalEntry;
}

@Component({
  selector: 'app-delete-journal-entry',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-journal-entry.component.html',
  styleUrls: ['./delete-journal-entry.component.scss']
})
export class DeleteJournalEntryComponent {
  public dialogRef = inject(MatDialogRef<DeleteJournalEntryComponent>)
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public back() {
    this.dialogRef.close(false);
  }

  public delete() {
    this.dialogRef.close(true);
  }
}
