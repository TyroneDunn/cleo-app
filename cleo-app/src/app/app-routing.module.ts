import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OnboardComponent} from "./onboard/onboard.component";
import {AboutComponent} from "./about/about.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {JournalsComponent} from "./journal/journals/journals.component";
import {JournalDetailComponent} from "./journal/journal-detail/journal-detail.component";
import {EntryDetailComponent}
  from "./entry/entry-detail/entry-detail.component";
import {AuthGuard} from "./user/auth-guard.service";
import {TermsOfServiceComponent} from "./terms-of-service/terms-of-service.component";
import {NewEntryComponent} from "./entry/new-entry/new-entry.component";

const routes: Routes = [
  {path: '', component: OnboardComponent},
  {path: 'about', component: AboutComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'journals', component: JournalsComponent, canActivate: [AuthGuard]},
  {path: 'journals/:id', component: JournalDetailComponent, canActivate: [AuthGuard]},
  {path: 'journals/:id/new-entry', component: NewEntryComponent, canActivate: [AuthGuard]},
  {path: 'entries/:id', component: EntryDetailComponent, canActivate: [AuthGuard]},
  {path: 'terms-of-service', component: TermsOfServiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
