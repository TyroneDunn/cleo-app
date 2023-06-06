import {CreateJournalDTO, GetJournalsDTO, UpdateJournalDTO} from "./journal-dtos";
import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export interface JournalService {
  getJournals$: (dto: GetJournalsDTO) => Observable<Journal[]>;
  getJournal$(id: string): Observable<Journal | null>;
  createJournal$(dto: CreateJournalDTO): Observable<Journal>;
  deleteJournal$(id: string): Observable<Journal>;
  updateJournal$(dto: UpdateJournalDTO): Observable<Journal>;
}
