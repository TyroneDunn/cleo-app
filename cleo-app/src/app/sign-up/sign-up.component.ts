import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BehaviorSubject} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators}
  from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {SignUpResponse, AuthError, UserService} from "../user/user.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {APP_JOURNALS, APP_SIGN_IN} from "../../environments/constants";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  public signUpForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.minLength(4)],
    password: ['', Validators.minLength(8)],
  })
  public error = new BehaviorSubject<string>('');

  public submit() {
    if (this.signUpForm.get('username')?.invalid
      && this.signUpForm.get('password')?.invalid) {
      this.error.next('Invalid username and password.');
      return;
    }

    if (this.signUpForm.get('username')?.invalid) {
      this.error.next('Invalid username.');
      return;
    }

    if (this.signUpForm.get('password')?.invalid) {
      this.error.next('Invalid password.');
      return;
    }

    const username = this.signUpForm.get('username')?.value as string;
    const password = this.signUpForm.get('password')?.value as string;
    this.signUp(username, password);
  }

  private signUp(username: string, password: string) {
    this.userService.signUp$(username, password).subscribe(async (response: SignUpResponse) => {
      if (!response.success)
        if (response.error)
          this.error.next((response.error.error as AuthError).error || '');
      else
        this.login(username, password);
    });
  }

  private login(username: string, password: string) {
    this.userService.signIn$(username, password).subscribe(async (okStatus) => {
      if (!okStatus) {
        await this.router.navigate([APP_SIGN_IN]);
        return;
      }

      await this.router.navigate([APP_JOURNALS]);
    });
  }

  public ngOnDestroy() {
    this.error.unsubscribe();
  }
}
