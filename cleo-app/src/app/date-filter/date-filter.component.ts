import {Component, Inject, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";

interface DialogData {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatRippleModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<DateFilterComponent>)
  public form!: FormGroup;
  public startDate = new BehaviorSubject<string>('');
  public endDate = new BehaviorSubject<string>('');

  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.startDate.next(data.startDate);
    this.endDate.next(data.endDate);
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      dateRange: new FormGroup({
        startDate: new FormControl(new Date(this.startDate.value)),
        endDate: new FormControl(new Date(this.endDate.value)),
      })
    });
  }

  public onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }

  public onReset(): void {
    this.dialogRef.close({dateRange: {startDate: null, endDate: null}});
  }
}
