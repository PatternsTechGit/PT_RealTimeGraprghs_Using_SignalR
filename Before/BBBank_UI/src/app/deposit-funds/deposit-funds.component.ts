import { Component, OnInit } from '@angular/core';
import { AccountByX } from '../models/account-by-x';
import DepositRequest from '../models/deposit-request';
import { lineGraphData } from '../models/line-graph-data';
import AccountsService from '../services/accounts.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-deposit-funds',
  templateUrl: './deposit-funds.component.html',
  styleUrls: ['./deposit-funds.component.css']
})
export class DepositFundsComponent implements OnInit {

  title = 'BBBankUI';
  lineGraphData: lineGraphData;
  account: AccountByX;
  message: string;
  amount: number;
  constructor(private accountsService: AccountsService,private transactionService:TransactionService) { }

  ngOnInit(): void {
    this.initialize();
    this.account.accountNumber = '0001-1001';
    
    this.getToAccount();
  }

  getToAccount() {
    this.accountsService
      .getAccountByAccountNumber(this.account.accountNumber)
      .subscribe({
        next: (data) => {
            this.account = data
        },
        error: (error) => {
          this.message = String(error);
        },
      });
  }

  cancel(){
    this.amount=0;
  }
    
  deposit() {
    const depositRequest: DepositRequest = {
      accountId: this.account.accountNumber,
      amount: this.amount
    };
    this.transactionService
      .deposit(depositRequest)
      .subscribe({
        next: (data) => {
          if (data.statusCode == 204) {
            this.message = String(data.result);
            this.initialize();

          } else {
            this.account.currentBalance += this.amount;
            this.amount=0;
          }
        },
        error: (err) => {
          console.error(err)
        },
      });
  } 

  initialize() {
    this.message = '';
    this.account = new AccountByX();
    this.account.currentBalance = 0;
    this.account.userImageUrl = '../../../assets/images/No-Image.png'
  }
}
