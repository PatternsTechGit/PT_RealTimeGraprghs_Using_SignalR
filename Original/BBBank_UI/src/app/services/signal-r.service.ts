import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor(private globalService : GlobalService ) {
  }

  public connectToTransactionHub = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrlBase + 'updateAll',{
      })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Established', "BBBank"))
      .catch(err => console.log('Error while starting connection: ' + err, "BBBank"));
  }

  public addUpdateGraphsDataListener = () => {
    this.hubConnection.on('updateGraphsData', (userId : string) => {
     console.log('addUpdateGraphsDataListener', userId);
     
     this.globalService.sendData(userId);

    });
  }
}
