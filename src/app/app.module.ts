/* src/app/app.module.ts */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // CRITICAL IMPORT

import { AppComponent } from './app.component';
import { InformationComponent } from './features/information/information.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { IdentityService } from './services/identity.service';
import { TransactionService } from './services/transaction.service';

@NgModule({
  declarations: [
    AppComponent,
    InformationComponent, // REGISTERING THE DOSSIER
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule // ACTIVATING FORM LOGIC
  ],
  providers: [IdentityService, TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
