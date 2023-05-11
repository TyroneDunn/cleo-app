import {Component, inject} from '@angular/core';
import {UserService} from "./user/user.service";
import {BehaviorSubject, delay, timeout} from "rxjs";
import {JOURNALS} from "./app-routing.constants";
import {SubSink} from "../utils/sub-sink";
import {Router} from "@angular/router";

type state = 'loading' | 'completed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private sink = new SubSink();
  public state = new BehaviorSubject<state>('loading');

  public ngOnInit() {
    this.sink.collect(
      this.userService.authorized$
        .pipe(
          timeout(2000),
          delay(2000),
        )
        .subscribe(async (okStatus) => {
          this.state.next('completed');
          if (okStatus) {
            await this.router.navigate([JOURNALS]);
          }
        })
    );
  }

  public ngOnDestroy() {
    this.state.unsubscribe();
  }
}
