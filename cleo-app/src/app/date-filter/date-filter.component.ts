import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogRef} from "@angular/material/dialog";

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
  ],
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<DateFilterComponent>)
  public form!: FormGroup;
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      dateRange: new FormGroup({
        startDate: new FormControl(),
        endDate: new FormControl(),
      })
    });
  }
  public onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }
  public onReset() {
    this.dialogRef.close({dateRange: {startDate: null, endDate: null}});
  }
}
