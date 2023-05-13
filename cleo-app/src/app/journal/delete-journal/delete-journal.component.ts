import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {Journal} from "../journal.type";
import {MatButtonModule} from "@angular/material/button";

interface DialogData {
  journal: Journal;
}

@Component({
  selector: 'app-delete-journal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './delete-journal.component.html',
  styleUrls: ['./delete-journal.component.scss']
})
export class DeleteJournalComponent {
  public dialogRef = inject(MatDialogRef<DeleteJournalComponent>)
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public delete() {
    this.dialogRef.close(true);
  }

  public back() {
    this.dialogRef.close(false);
  }
}
