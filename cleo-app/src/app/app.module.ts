import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {SplashComponent} from "./splash/splash.component";
import {MatDialogModule} from "@angular/material/dialog";
import {QuillModule} from "ngx-quill";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      SplashComponent,
      MatDialogModule,
      QuillModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
