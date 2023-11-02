import {inject, Injectable} from '@angular/core';
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
private userService = inject(UserService);

  canActivate() {
    return this.userService.authorized$;
  }
}
