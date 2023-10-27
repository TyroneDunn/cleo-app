import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Entry} from "../entry.type";

interface DialogData {
  journalEntry: Entry;
}

@Component({
  selector: 'app-delete-entry',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-entry.component.html',
  styleUrls: ['./delete-entry.component.scss']
})
export class DeleteEntryComponent {
  public dialogRef = inject(MatDialogRef<DeleteEntryComponent>)
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public back() {
    this.dialogRef.close(false);
  }

  public delete() {
    this.dialogRef.close(true);
  }
}
