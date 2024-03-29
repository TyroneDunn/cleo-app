import {Component, inject} from '@angular/core';
import {UserService} from "./user/user.service";
import {BehaviorSubject, delay, timeout} from "rxjs";
import {Router} from "@angular/router";
import {APP_HOME} from "../environments/constants";

type state = 'loading' | 'completed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  public state = new BehaviorSubject<state>('loading');

  public ngOnInit() {
    this.userService.authorized$
      .pipe(
        timeout(2000),
        delay(2000),
      )
      .subscribe(async (okStatus) => {
        this.state.next('completed');
        if (!okStatus)
          await this.router.navigate([APP_HOME]);
      });
  }

  public ngOnDestroy() {
    this.state.unsubscribe();
  }
}
