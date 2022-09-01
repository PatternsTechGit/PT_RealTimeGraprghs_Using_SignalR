import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepositFundsComponent } from './deposit-funds/deposit-funds.component';

const routes: Routes = [
  {path: "", component: DashboardComponent},
  {path: "deposit-funds", component: DepositFundsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
