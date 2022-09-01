import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lineGraphData } from '../models/line-graph-data';
import { environment } from 'src/environments/environment';
import DepositRequest, { DepositResponse } from '../models/deposit-request';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private httpclient: HttpClient) {}
  GetLast12MonthBalances(userId: string): Observable<lineGraphData> {
    return this.httpclient.get<lineGraphData>(
      environment.apiUrlBase + 'Transaction/GetLast12MonthBalances/' + userId
    );
  }
  deposit(depositRequest: DepositRequest): Observable<DepositResponse> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.httpclient.post<DepositResponse>(`${environment.apiUrlBase}Transaction/Deposit`, JSON.stringify(depositRequest), headers);
  }
}
