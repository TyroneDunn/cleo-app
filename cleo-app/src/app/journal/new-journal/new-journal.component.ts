import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {Journal} from "../journal.type";

interface DialogData {
  journal: Journal;
}

@Component({
  selector: 'app-new-journal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-journal.component.html',
  styleUrls: ['./new-journal.component.scss']
})
export class NewJournalComponent {
  private formBuilder = inject(FormBuilder);
  public nameForm = this.formBuilder.group({
    name: ['', Validators.maxLength(64)],
  });

  public dialogRef = inject(MatDialogRef<NewJournalComponent>)
  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  public createJournal() {
    const name = this.nameForm.get('name')?.value as string;
    this.dialogRef.close(name);
  }

  public back() {
    this.dialogRef.close();
  }
}
