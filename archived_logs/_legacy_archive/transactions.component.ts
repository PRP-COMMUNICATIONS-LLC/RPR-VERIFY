import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="transactions-placeholder"><h1>Transactions placeholder</h1></div>`,
    styles: [`.transactions-placeholder { color: white; padding: 20px; }`]
})
export class TransactionsComponent { }
