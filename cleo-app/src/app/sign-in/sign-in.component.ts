import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SubSink} from "../../utils/sub-sink";
import {UserService} from "../user/user.service";
import {JOURNALS} from "../app-routing.constants";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private sink = new SubSink();
  public signInForm = this.formBuilder.group({
    username: ['', Validators.minLength(4)],
    password: ['', Validators.minLength(8)],
  });
  public error = new BehaviorSubject<string>('');
  onSubmit() {
    if (this.signInForm.get('username')?.invalid && this.signInForm.get('password')?.invalid) {
      this.error.next('Invalid username and password.');
      return;
    }

    if (this.signInForm.get('username')?.invalid) {
      this.error.next('Invalid username.');
      return;
    }

    if (this.signInForm.get('password')?.invalid) {
      this.error.next('Invalid password.');
      return;
    }

    const username = this.signInForm.get('username')?.value as string;
    const password = this.signInForm.get('password')?.value as string;
    console.log('1. username and password: ', username, password);
    this.signIn(username, password);
  }

  private signIn(username: string, password: string) {
    this.sink.collect(
      this.userService.login$(username, password).subscribe(async (success) => {
        console.log('username and password: ', username, password);
        if (!success) {
          this.error.next('Incorrect username or password.');
          return;
        }
        await this.router.navigate([JOURNALS]);
      })
    );
  }

  public ngOnDestroy() {
    this.error.unsubscribe();
    this.sink.drain();
  }
}
