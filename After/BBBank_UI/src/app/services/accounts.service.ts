import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { AccountByX } from '../models/account-by-x';


@Injectable({
  providedIn: 'root',
})
export default class AccountsService {
  constructor(private httpClient: HttpClient) { }

  getAccountByAccountNumber(accountNumber: string): Observable<AccountByX> {
    return this.httpClient.get<AccountByX>(`${environment.apiUrlBase}Accounts/GetAccountByAccountNumber/${accountNumber}`);
  }

}