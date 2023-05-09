import {Component, inject} from '@angular/core';
import {UserService} from "./user/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userService = inject(UserService);
  public authorized$ = this.userService.authorized$;
}
