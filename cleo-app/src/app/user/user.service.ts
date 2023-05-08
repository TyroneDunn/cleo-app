import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {catchError, map, Observable, of} from "rxjs";
import {CLEO_API_PROTECTED_URL, CLEO_API_REGISTER_URL} from "./user.constants";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpService);
  public readonly authorized$: Observable<boolean> =
    this.http.getRequest$<boolean>(CLEO_API_PROTECTED_URL).pipe(
      map((response) => {
        return response.ok;
      }),
      catchError((response: HttpErrorResponse): Observable<boolean> => {
        return of(response.ok);
      }),
    );

  public register$(username: string, password: string): Observable<boolean> {
    const payload = {
      username: username,
      password: password,
    };

    return this.http.postRequest$(CLEO_API_REGISTER_URL, payload).pipe(
      map((response) => {
        return response.ok;
      }),
    );
  }
}
