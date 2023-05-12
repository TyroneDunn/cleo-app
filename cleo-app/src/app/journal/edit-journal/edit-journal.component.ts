import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../delete-journal/delete-journal.component";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

type state = 'unedited' | 'edited';

@Component({
  selector: 'app-edit-journal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.scss']
})
export class EditJournalComponent {
  private readonly name;
  private state: state = 'unedited';
  private formBuilder = inject(FormBuilder);
  public nameForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });

  public dialogRef = inject(MatDialogRef<EditJournalComponent>)
  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.name = data.journal.name;
  }

  public editJournal() {
    const editedName = this.nameForm.get('name')?.value as string;

    if (editedName === this.name) {
      this.back();
      return;
    }

    this.state = "edited";
    this.dialogRef.close(editedName);
  }

  public back() {
    this.dialogRef.close();
  }

  public ngOnDestroy() {
    if (this.state === "unedited") {
      if (this.data.journal.name !== this.name)
        this.data.journal.name = this.name;
    }
  }
}
