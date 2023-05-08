import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {UserService} from "../user/user.service";
import {SubSink} from "../../utils/sub-sink";
import {BehaviorSubject, delay, timeout} from "rxjs";

type State = 'loading' | 'isAuthorized' | 'notAuthorized';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
  public userService = inject(UserService);
  private sink = new SubSink();
  public authorized$ = new BehaviorSubject<State>("loading");

  public ngOnInit() {
    this.sink.collect(
      this.userService.authorized$
        .pipe(
          timeout(2000),
          delay(2000),
        )
        .subscribe((okStatus) => {
          if (!okStatus) {
            this.authorized$.next("notAuthorized");
            return;
          }

          this.authorized$.next("isAuthorized");
      })
    );
  }
}
