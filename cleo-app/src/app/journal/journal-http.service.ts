import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {catchError, map, Observable, of} from "rxjs";
import {Journal} from "./journal.type";
import {CLEO_API_JOURNALS_URL} from "./journal.constants";
import {getJournalsDTO} from "./journal-dtos";
import {JournalService} from "./journal.service";

@Injectable({
  providedIn: 'root'
})
export class JournalHttpService implements JournalService {
  private http = inject(HttpService);

  public getJournals$ = (dto: getJournalsDTO): Observable<Journal[]> => {
    const url = this.mapToGetJournalsURL(dto);
    return this.http.getRequest$<Journal[]>(url).pipe(
      map((response) => {
        return response.body as Journal[];
      }),
      catchError(() => {
        return of([]);
      }),
    );
  };

  private mapToGetJournalsURL = (dto: getJournalsDTO) => {
    let url = CLEO_API_JOURNALS_URL;
    if (dto.name)
      url.concat('?name')
    if (dto.sort)
      url.concat('?')
    return url;
  };

  public getJournal$ = (id: string): Observable<Journal | null> =>
    this.http.getRequest$<Journal | null>(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public createJournal$ = (name: string): Observable<Journal> => {
    const payload = {name: name};
    return this.http.postRequest$(CLEO_API_JOURNALS_URL, payload).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );
  };

  public deleteJournal$ = (id: string): Observable<Journal> =>
    this.http.deleteRequest$(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public patchJournalName$ = (id: string, name: string): Observable<boolean> => {
    const payload = {name: name};
    return this.http.patchRequest$<object>(`${CLEO_API_JOURNALS_URL}${id}`, payload).pipe(
      map((response) => {
        return response.ok
      }),
      catchError(() => {
        return of(false);
      }),
    );
  };
}
