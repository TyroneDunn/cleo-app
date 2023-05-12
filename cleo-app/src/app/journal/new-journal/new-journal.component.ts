import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {JournalService} from "../journal.service";
import {SubSink} from "../../../utils/sub-sink";
import {Router} from "@angular/router";

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
  private router = inject(Router);
  private journalService = inject(JournalService);
  private sink = new SubSink();
  private formBuilder = inject(FormBuilder);
  public nameForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  public createJournal() {
    const name = this.nameForm.get('name')?.value as string;
    this.sink.collect(
      this.journalService.createJournal$(name).subscribe(async (journal) => {
        if (!journal)
          return;
        await this.router.navigate([`journal/${journal._id}`]);
      })
    );
  }
}
