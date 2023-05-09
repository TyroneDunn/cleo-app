import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnboardComponent} from "./onboard/onboard.component";
import {AboutComponent} from "./about/about.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {JournalsComponent} from "./journal/journals/journals.component";
import {CreateJournalComponent} from "./journal/create-journal/create-journal.component";
import {JournalDetailComponent} from "./journal/journal-detail/journal-detail.component";
import {
  JournalEntryDetailComponent
} from "./journal-entry/journal-entry-detail/journal-entry-detail.component";

const routes: Routes = [
  {path: '', component: OnboardComponent},
  {path: 'about', component: AboutComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'journals', component: JournalsComponent},
  {path: 'journal/:id', component: JournalDetailComponent},
  {path: 'journal-entry/:id', component: JournalEntryDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
