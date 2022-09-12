import {Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {Chart, LinearScale, CategoryScale, registerables,} from 'chart.js';
import { lineGraphData } from './models/line-graph-data';
import { SignalRService } from './services/signal-r.service';
import { TransactionService } from './services/transaction.service';

Chart.register(LinearScale, CategoryScale);
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  implements OnInit {

  constructor(
    public signalRService: SignalRService) {

  }

  ngOnInit(): void {
    this.signalRService.connectToTransactionHub();
    this.signalRService.addUpdateGraphsDataListener();
  }
}