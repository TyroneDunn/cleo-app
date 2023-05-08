import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {map, Observable} from "rxjs";
import {CLEO_API_PROTECTED_URL} from "./user.constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpService);
  public readonly authorized$: Observable<boolean> =
    this.http.getRequest$(CLEO_API_PROTECTED_URL).pipe(
      map((response) => {
        return response.ok;
      })
    );
}
