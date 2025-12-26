/* src/app/app.module.ts */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // CRITICAL IMPORT

import { AppComponent } from './app.component';
import { InformationComponent } from './features/information/information.component';
import { IdentityService } from './services/identity.service';

@NgModule({
  declarations: [
    AppComponent,
    InformationComponent // REGISTERING THE DOSSIER
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule // ACTIVATING FORM LOGIC
  ],
  providers: [IdentityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
