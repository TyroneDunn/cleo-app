import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OnboardComponent} from "./onboard/onboard.component";
import {AboutComponent} from "./about/about.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {JournalsComponent} from "./journal/journals/journals.component";
import {JournalDetailComponent} from "./journal/journal-detail/journal-detail.component";
import {JournalEntryDetailComponent}
  from "./journal-entry/journal-entry-detail/journal-entry-detail.component";
import {AuthGuard} from "./user/auth-guard.service";
import {TermsOfServiceComponent} from "./terms-of-service/terms-of-service.component";
import {PrivacyStatementComponent} from "./privacy-statement/privacy-statement.component";

const routes: Routes = [
  {path: '', component: OnboardComponent},
  {path: 'about', component: AboutComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'journals', component: JournalsComponent, canActivate: [AuthGuard]},
  {path: 'journal/:id', component: JournalDetailComponent, canActivate: [AuthGuard]},
  {path: 'journal/:journalId/journal-entry/:entryId', component: JournalEntryDetailComponent, canActivate: [AuthGuard]},
  {path: 'terms-of-service', component: TermsOfServiceComponent},
  {path: 'privacy-statement', component: PrivacyStatementComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
