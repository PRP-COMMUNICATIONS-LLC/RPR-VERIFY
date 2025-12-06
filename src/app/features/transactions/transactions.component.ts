import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule],
    template: `<div style="color:white; padding: 20px;"><h1>Transactions placeholder</h1></div>`
})
export class TransactionsComponent { }
