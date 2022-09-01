import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  // private hubConnection: HubConnection;
  // loggedInUserSub: Subscription;
  // loggedInUser: AppUser;

  // constructor(private appStore: Store<AppState>, private sharedStore: Store<SharedState>, private notifyService: NotificationService) {


  //   this.loggedInUserSub = this.appStore
  //     .select(loggedInUser)
  //     .subscribe((user: AppUser) => {
  //       if (user != null) {
  //         this.loggedInUser = user
  //       }
  //     });

  // }
  // public connectToTransactionHub = () => {
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(environment.apiUrlBase + 'updateAll')
  //     .build();
  //   this.hubConnection
  //     .start()
  //     .then(() => this.notifyService.showInfo('SignalR Connection Established', "BBBank"))
  //     .catch(err => this.notifyService.showError('Error while starting connection: ' + err, "BBBank"));
  // }

  // public addUpdateGraphsDataListener = () => {
  //   this.hubConnection.on('updateGraphsData', (userId) => {
  //     // server will send signalR messages to everyone
  //     // but if logged in user is bank manager we need to update graph
  //     if(this.loggedInUser?.roles.includes('bank-manager')){
  //       this.sharedStore.dispatch(DashBoardActions.loadLast12MonthsBalances({ userId: null }));
  //       this.sharedStore.dispatch(DashBoardActions.loadAllTransactions({ userId: null }));
  //     }
  //     // but if logged in user is an account holder we will update only if id matches
  //     if(this.loggedInUser?.roles.includes('account-holder')){
  //       if (userId == this.loggedInUser?.id){
  //         this.sharedStore.dispatch(DashBoardActions.loadLast12MonthsBalances({ userId: this.loggedInUser?.id }));
  //         this.sharedStore.dispatch(DashBoardActions.loadAllTransactions({ userId: this.loggedInUser?.id }));
  //       }
        
  //     }
  //   });
  // }
  // ngOnDestroy() {
  //   this.loggedInUserSub.unsubscribe();
  // }
}
