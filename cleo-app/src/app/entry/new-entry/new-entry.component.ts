import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntryHttpService} from '../entry-http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {QuillEditorComponent} from "ngx-quill";
import {FormsModule} from "@angular/forms";
import {CreateEntryDTO} from "../entry-dtos";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-entry',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    QuillEditorComponent,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent {
  private snackBar = inject(MatSnackBar);
  private entryService = inject(EntryHttpService);
  public createEntryDTO$!: BehaviorSubject<CreateEntryDTO>;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private journalID$ = new BehaviorSubject<string>('');

  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.journalID$.next(params.get('id') as string);
      this.createEntryDTO$ = new BehaviorSubject<CreateEntryDTO>({
        journal: this.journalID$.value,
        title: '',
        body: '',
      });
    })
  }

  public async doneEditing() {
    if (this.createEntryDTO$.value) {
      if (this.createEntryDTO$.value.title) {
        this.entryService.createJournalEntry$(this.createEntryDTO$.value)
          .subscribe(async (journalEntry) => {
            if (journalEntry) {
              this.notify('Entry created.');
            }
          })
      }
      else if (this.createEntryDTO$.value.body){
        this.notify('Please enter a title.');
        return;
      }
    }
    await this.router.navigate([`journals/${this.journalID$.value}`]);
  }

  private notify(message: string): void {
    this.snackBar.open(message, '×', {
      duration: 3000,
      horizontalPosition: "left",
      verticalPosition: "bottom",
    });
  }
}
