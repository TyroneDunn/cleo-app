import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {SplashComponent} from "../splash/splash.component";
import {UserService} from "../user/user.service";

@Component({
  selector: 'app-onboard',
  standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        SplashComponent,
    ],
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
  private userService = inject(UserService);
  public authorized$ = this.userService.authorized$;
}
