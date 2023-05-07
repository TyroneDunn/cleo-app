import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnboardComponent} from "./onboard/onboard.component";

const routes: Routes = [
  {path: '', component: OnboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
