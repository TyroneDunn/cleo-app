import {inject, Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
private userService = inject(UserService);

  public canActivate(): Observable<boolean> {
    return this.userService.authorized$;
  }
}
