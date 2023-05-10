import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {catchError, map, Observable, of} from "rxjs";
import {Journal} from "./journal.type";
import {CLEO_API_JOURNALS_URL} from "./journal.constants";

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private http = inject(HttpService);

  public journals$(): Observable<Journal[]> {
    return this.http.getRequest$<Journal[]>(CLEO_API_JOURNALS_URL).pipe(
      map((response) => {
        return response.body as Journal[];
      }),
      catchError(() => {
        return of([]);
      }),
    );
  };

  public journal$(id: string): Observable<Journal | undefined> {
    return this.http.getRequest$(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      }),
      catchError(() => {
        return of(undefined);
      }),
    );
  }

  public createJournal$(name: string): Observable<Journal | undefined> {
    const payload = {name: name};
    return this.http.postRequest$(CLEO_API_JOURNALS_URL, payload).pipe(
      map((response) => {
        return response.body as Journal;
      }),
      catchError(() => {
        return of(undefined);
      }),
    );
  }

  public deleteJournal$(id: string): Observable<boolean> {
    const payload = {id: id};
    return this.http.deleteRequest$(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.ok;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
