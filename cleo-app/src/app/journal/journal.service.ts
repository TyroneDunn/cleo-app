import {getJournalsDTO} from "./journal-dtos";
import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export interface JournalService {
  getJournals$: (dto: getJournalsDTO) => Observable<Journal[]>;
  getJournal$(id: string): Observable<Journal | null>;
  createJournal$(name: string): Observable<Journal>;
  deleteJournal$(id: string): Observable<Journal>;
}
