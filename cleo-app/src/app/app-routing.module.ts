import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OnboardComponent} from "./onboard/onboard.component";
import {AboutComponent} from "./about/about.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {JournalsContainerComponent} from "./journal/journals-container/journals-container.component";
import {JournalDetailComponent} from "./journal/journal-detail/journal-detail.component";
import {JournalEntryDetailComponent}
  from "./journal-entry/journal-entry-detail/journal-entry-detail.component";
import {AuthGuard} from "./user/auth-guard.service";
import {TermsOfServiceComponent} from "./terms-of-service/terms-of-service.component";

const routes: Routes = [
  {path: '', component: OnboardComponent},
  {path: 'about', component: AboutComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'journals-container', component: JournalsContainerComponent, canActivate: [AuthGuard]},
  {path: 'journals-container/:id', component: JournalDetailComponent, canActivate: [AuthGuard]},
  {path: 'entries/:id', component: JournalEntryDetailComponent, canActivate: [AuthGuard]},
  {path: 'journal/:journalId/journal-entry/:entryId', component: JournalEntryDetailComponent, canActivate: [AuthGuard]},
  {path: 'terms-of-service', component: TermsOfServiceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
