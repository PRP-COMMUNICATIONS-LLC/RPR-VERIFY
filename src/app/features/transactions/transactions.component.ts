import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  currentWeek: string = 'W52';

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    this.loadWeek();
  }

  onWeekChange(event: any) {
    this.currentWeek = event.target.value;
    this.loadWeek();
  }

  private loadWeek() {
    this.transactions$ = this.txService.getTransactionsByWeek(this.currentWeek);
  }
}
