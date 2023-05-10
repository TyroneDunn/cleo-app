import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Journal} from "../journal.type";
import {JournalService} from "../journal.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {SubSink} from "../../../utils/sub-sink";

const CACHED_JOURNAL: Journal = {
  _id: '0',
  name: '',
  lastUpdated: new Date(),
  dateOfCreation: new Date(),
}

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent {
  private route = inject(ActivatedRoute);
  private journalService = inject(JournalService);
  private id = new BehaviorSubject<string>('');
  private journal = new BehaviorSubject<Journal>(CACHED_JOURNAL);
  private sink = new SubSink();

  public ngOnInit() {
    this.sink.collect(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id') as string;
        this.id.next(id);
        this.sink.collect(
          this.journalService.journal$(this.id.value).subscribe((journal) => {
            this.journal.next(journal);
          })
        )
      })
    );
  }

  public ngOnDestroy() {
    this.sink.drain();
    this.id.unsubscribe();
    this.journal.unsubscribe();
  }
}
