# SignalR with Real-Time Graph

## What is SignalR?
**SignalR is an open-source project that enables real-time, bi-directional web communication from server to client**. Using SignalR, you can write server-side code that can **communicate with the clients instantly**.

In typical web applications, the communication flow is one-way, i.e. from the client to the server. The client initiates a request to the server, the server performs some tasks and sends the response to the client.

SignalR simplifies the process of adding **real-time web functionality to web applications**, where the server code pushes content to connected clients as soon as it becomes available. This frees the clients from repeatedly polling the server and having the server wait for a client to request new data.

SignalR provides an API for creating server-to-client remote procedure calls (RPC) that call JavaScript code in the client browsers (and other client platforms) from server-side .NET code. SignalR also includes an API for connection management (for instance, connect and disconnect events), and grouping connections.

![](./readme-images/13.png)

### **SignalR Uses Various Technologies**
SignalR uses various technologies to handle real-time communication from the server to the client such as:
* WebSockets
* Server-Sent Events
* Long Polling

It automatically selects the optimal transport method depending upon the capabilities of the server and clients.

### **Applications of SignalR**
Although a chat is a common example used for SignalR, you can do a whole lot more. Here are some excellent applications of SignalR.

* User notifications
* Sending high-frequency updates to clients
* Dashboards containing real-time charts and graphs
* Collaborative applications, such as chat and messaging services
* Games and entertainment applications
* Alerting mechanisms

---------------

## About this exercise
In this lab we will be working on two code Bases, **Backend Code base** and **Frontend Code Base**

## **Backend Code Base**
Previously we developed a base structure of an API solution in Asp.net core that have just two controllers i.e **AccountsController** and **TransactionController**. 

* **AccountsController** has a method `GetAccountByAccountNumber` which takes in account number as a parameter and returns the account matching it

* **TransactionController** has three methods. `GetLast12MonthBalances` and `GetLast12MonthBalances/{userId}` which returns data of the last 12 months total balances and a `Deposit` method deposits credit from one account to the other.



There are 4 Projects in the solution. 

*	**Entities** : This project **contains DB models** like User where each User has one Account and each Account can have one or many Transactions. There is also a Response Model of LineGraphData that will be returned as API Response. 

*	**Infrastructure**: This project **contains BBBankContext** that service as fake DBContext that populates one User with its corresponding Account that has three Transactions dated of last three months with hardcoded data. 

* **Services**: This project **contains TransactionService** with the logic of converting Transactions into LineGraphData after fetching them from BBBankContext.

* **BBBankAPI**: This project **contains controller** which are mentioned above 

![](./readme-images/4.png)

-----------

## **Frontend Code Base**
Previously we scaffolded a new Angular application in which we have integrated 

* **FontAwesome** library for icons
* **Bootstrap library** for styling.
* **Toolbar** which contains the user profile 
*  **Side navigation bar** which contains the user name and image and two routs for **Dashboard and Deposit-funds**
*  **Dashboard** component contains the a graph which is populated with the `GetLast12MonthBalances` method


![](./readme-images/11.png)

*  **Deposit-funds** component has the functionality to deposit funds from one account to the other
  
![](./readme-images/12.png)

_____________

## **In this exercise**

**Cloud Configuration**
* **Step 1: Create a signalR resource** in the Azure

**Backend Code**
* **Step 1: Install required packages**
* **Step 2: Add configuration for signalR** in the `program.cs`
* **Step 3: Create aTransactionHUB class**
* **Step 4: Inject TransactionHUB with IHubContext** and modify the transaction service 

**Frontend Code**
* **Step 1: Install required packages**
* **Step 2: Create an signalR service** 
* **Step 3: Create an global service** 
* **Step 4: Subscribe the global service observable to initialize the graph** 
* **Step 5: Configuring SignalRService** in app Component 

# **Cloud Configuration**
### **Step 1: SignalR Configuration**
Go to [Azure Portal](https://portal.azure.com/), search SignalR and click create button.

Enter the required details and click `Review + create` button.
![111](https://user-images.githubusercontent.com/100709775/190474558-51a0667e-c09f-4ee8-b91c-14dbc39544cb.PNG)


Once the **SignalR** resource is created then click on the **Go to resources**.

Click on the `Connection String` menu and copy the connection string.

![2](https://user-images.githubusercontent.com/100709775/190474328-d1c5258d-4a1d-4c2e-bad1-0ec4dd0f8f15.PNG)

# **Backend Implementation**
Follow the below steps to implement backend code 

### **Step 1: Install required packages**
Install the given packages in the **Services** project of the solution from package manager consol  

```cs
Microsoft.Azure.SignalR
```

### **Step 2: Configuration for signalR**
Add the connection string for the signalR in the `appSetting.json` file as given below

```json
"SignalRConnectionString": "Endpoint=https://************.service.signalr.net;AccessKey=4k1fcO4fUwzqmeSTi/CWrwr0E891PmXRf3lR5mlIvpU=;Version=1.0;",
```

Add configuration for signalR in the `program.cs` as given below

```cs
//Confiuration Builder based on AppSettings File
var appSettingsFileSettings = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

// builder.Services.AddScoped<ModuleLoader>();
var SignalRConString = appSettingsFileSettings["SignalRConnectionString"];
builder.Services.AddSignalR().AddAzureSignalR(SignalRConString);

app.UseRouting();
//Adding signalr middleware
app.UseEndpoints(endpoints =>
{
    // letting application know about diffrent hubs in our aplicaiton 
    // mapping hub to a route (one route per hub)
    endpoints.MapHub<TransactionHUB>("/api/updateAll");
});
```

### **Step 3: TransactionHUB Class**
Create a TransactionHUB class in the **Services** project. This class acts as a hub and responsible for sending data to the clients.

```cs
 public class TransactionHUB : Hub
    {
        public async Task Send()
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("updateGraphsData");
        }
    }
```

### **Step 4: Modify Transaction Service**
Inject TransactionHUB with IHubContext and modify the **DepositFunds** method of the transaction service to send pass the function name as a first parameter and data as a second, as below 

```cs
private readonly BBBankContext _bbBankContext;
        private readonly IHubContext<TransactionHUB> _transactionHubContext; 
        public TransactionService(BBBankContext BBBankContext, IHubContext<TransactionHUB> transactionHubContext)
        {
            _bbBankContext = BBBankContext;
            _transactionHubContext = transactionHubContext;
        }

public async Task<int> DepositFunds(DepositRequest depositRequest)
        {
            try
            {
                var account = _bbBankContext.Accounts.Where(x => x.AccountNumber == depositRequest.AccountId).FirstOrDefault();
                if (account == null)
                    return -1;
                else
                {
                    var transaction = new Transaction()
                    {
                        Id = Guid.NewGuid().ToString(),
                        TransactionAmount = depositRequest.Amount,
                        TransactionDate = DateTime.UtcNow,
                        TransactionType = TransactionType.Deposit
                    };
                    if (account.Transactions != null)
                        account.Transactions.Add(transaction);

                    // technically bank manager cannot access this function.
                    await _transactionHubContext.Clients.All.SendAsync("updateGraphsData", "userId123");

                    return 1;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }
```

# **Frontend Implementation**
Follow the below steps to implement frontend code

### **Step 1: Install Required Packages**
Install the signalR package from the command line 

```ts
npm i @microsoft/signalr
```

### **Step 2: SignalR Service**
We will create an signalR service in the **services** folder. Open the integrated terminal by right clicking on the folder and run the given command  

```ts
ng generate service signalR
```
This service has two methods, **connectToTransactionHub** is responsible for hub creation and signalR connection establisher and the **addUpdateGraphsDataListener** is responsible for triggering the signalR, as below  


```ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment';
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
     this.globalService.sendData(userId);

    });
  }
}
```

### **Step 3: Global Service**
We will create an global service in the **services** folder. Open the integrated terminal by right clicking on the folder and run the given command  

```ts
ng generate service global
```
This service is responsible for communication between the components using the **BehaviorSubject** from RxJs. We created an observable which will be subscribed by the dashboard component for graph, as below 

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  private dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
  data: Observable<string> = this.dataSource.asObservable();

  constructor() { }

  sendData(data: string) {
    this.dataSource.next(data);
  }
}
```

### **Step 4: Real-time Graph**
In the dashboard component, **cut the body of ngAfterViewInit and create a new method named initializeGraph and paste the code**. Now create getData method and call this method in ngAfterViewInit. The **getData method**  will subscribe the global service observable and initializes the graph every time the funds are deposited.   

The **DashboardComponent** would look like this

```ts
export class DashboardComponent {
  @ViewChild('chartBig1') myCanvas: ElementRef;

  lineGraphData: lineGraphData;
  gradientChartOptionsConfigurationWithTooltipRed: any;
  public myChartData: any;
  public context: CanvasRenderingContext2D;

  constructor(private transactionService: TransactionService, private globalService : GlobalService ) {
    this.gradientChartOptionsConfigurationWithTooltipRed = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
      },
      responsive: true,
      scales: {
        yAxes:
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: 'transparent',
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: '#9a9a9a',
            },
          },

        xAxes:
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(233,32,16,0.1)',
              zeroLineColor: 'transparent',
            },
            ticks: {
              padding: 20,
              fontColor: '#9a9a9a',
            },
          },
      },
    };
  }

  ngAfterViewInit(): void {
   this.getData()
  }

  getData() {
    this.globalService.data.subscribe(response => {
      console.log(response);  

      this.initializeGraph()
    });
  }

  initializeGraph(){
    this.context = (this.myCanvas
      .nativeElement as HTMLCanvasElement).getContext('2d');
    this.transactionService
      .GetLast12MonthBalances('aa45e3c9-261d-41fe-a1b0-5b4dcf79cfd3')
      .subscribe({
        next: (data: lineGraphData) => {
          this.lineGraphData = data;

          const gradientStroke = this.context.createLinearGradient(0, 230, 0, 50);
          gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
          gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
          gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); // red colors

          this.myChartData = new Chart(this.context, {
            type: 'line',
            data: {
              labels: this.lineGraphData?.labels,
              datasets: [
                {
                  label: 'Last 12 Month Balances',
                  fill: true,
                  backgroundColor: gradientStroke,
                  borderColor: '#ec250d',
                  borderWidth: 2,
                  borderDashOffset: 0.0,
                  pointBackgroundColor: '#ec250d',
                  pointBorderColor: 'rgba(255,255,255,0)',
                  pointHoverBackgroundColor: '#ec250d',
                  pointBorderWidth: 20,
                  pointHoverRadius: 4,
                  pointHoverBorderWidth: 15,
                  pointRadius: 4,
                  data: this.lineGraphData?.figures,
                },
              ],
            },
            options: this.gradientChartOptionsConfigurationWithTooltipRed,
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
}
```
### **Step 5: Configuring SignalRService in app Component**
Now, configuring the signalRService in `app.component.ts`. These service methods will be invoked initially when the app starts, which will be triggered by the signalR later

```ts
export class AppComponent implements OnInit{
  constructor(public signalRService: SignalRService) {
  }

  ngOnInit(): void {
    this.signalRService.connectToTransactionHub();
    this.signalRService.addUpdateGraphsDataListener();
  }
}
```
# **Final Output**
In this lab, we have created two components, onw for real-time graph and the other for the funds transfer. We created a signalR resource and which updates the graph whenever the funds are transferred from onw account to the other.