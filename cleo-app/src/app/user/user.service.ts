import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {catchError, map, Observable, of} from "rxjs";
import {User} from "./user.type";
import {
  API_LOGIN_URL,
  API_LOGOUT_URL,
  API_PROTECTED_URL,
  API_REGISTER_URL
} from "../../environments/constants";

export type AuthError = {error?: string};

export type SignUpResponse = {
  success: boolean,
  error?: AuthError,
};

export type SignInResponse = {
  success: boolean,
  user?: User,
  error?: AuthError,
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpService);
  public user: User = {username: ""};
  public readonly authorized$: Observable<boolean> =
    this.http.getRequest$<object>(API_PROTECTED_URL).pipe(
      map((response) => {
          this.user = (response.body as User);
        return response.ok;
      }),
      catchError((): Observable<boolean> => {
        return of(false);
      }),
    );

  public signUp$(username: string, password: string): Observable<SignUpResponse> {
    const payload = {
      username: username,
      password: password,
    };

    return this.http.postRequest$(API_REGISTER_URL, payload).pipe(
      map((response) => {
        return {
          success: response.ok,
          response: response.body || undefined
        };
      }),
      catchError((err): Observable<SignUpResponse> => {
        return of({
          success: false,
          error: err
        });
      }),
    );
  }

  public signIn$(username: string, password: string): Observable<SignInResponse> {
    const payload = {
      username: username,
      password: password,
    };

    return this.http.postRequest$(API_LOGIN_URL, payload).pipe(
      map((response) => {
        return {
          success: response.ok,
          user: response.body as User  || undefined
        };
      }),
      catchError((err): Observable<SignInResponse> => {
        return of({
          success: false,
          error: err
        });
      })
    );
  }

  public logout$(): Observable<boolean> {
    return this.http.postRequest$(API_LOGOUT_URL, {}).pipe(
      map((response) => {
        this.user = {username: ''};
        return response.ok;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
