import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JournalService} from "../journal.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Journal} from "../journal.type";
import {SubSink} from "../../../utils/sub-sink";

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private journalService = inject(JournalService);
  private route = inject(ActivatedRoute);
  private sink = new SubSink();
  private id = new BehaviorSubject<string>('');
  private journal = new BehaviorSubject<Journal | undefined>(undefined);

  ngOnInit() {
    this.sink.collect(
      this.route.paramMap.subscribe(params => {
        this.id.next(params.get('id') as string);

        this.sink.collect(
          this.journalService.journal$(this.id.value).subscribe((journal) => {
            if (!journal) return;
            this.journal.next(journal);
          })
        );
      })
    );
  }


  public ngOnDestroy() {
    this.id.unsubscribe();
    this.journal.unsubscribe();
    this.sink.drain();
  }
}
