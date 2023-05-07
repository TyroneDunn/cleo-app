import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly options = {
    observe: 'response' as const,
    withCredentials: true,
    headers: new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("credentials", "true")
  };
  constructor() {}

  public getRequest$<T>(url: string): Observable<HttpResponse<T>> {
    return this.http.get<T>(url, this.options).pipe(
      retry(2),
    );
  }
}
