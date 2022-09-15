import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { Chart, LinearScale, CategoryScale, registerables, } from 'chart.js';
import { lineGraphData } from './models/line-graph-data';
import { TransactionService } from './services/transaction.service';
import { SignalRService } from './signal-r.service';

Chart.register(LinearScale, CategoryScale);
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(public signalRService: SignalRService) {
  }

  
  ngOnInit(): void {
    this.signalRService.connectToTransactionHub();
    this.signalRService.addUpdateGraphsDataListener();
  }

}