﻿using Entities;
using Entities.Request;
using Entities.Responses;
using Infrastructure;
using Microsoft.AspNetCore.SignalR;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class TransactionService : ITransactionService
    {
        private readonly BBBankContext _bbBankContext;
        private readonly IHubContext<TransactionHUB> _transactionHubContext;
        public TransactionService(BBBankContext BBBankContext, IHubContext<TransactionHUB> transactionHubContext)
        {
            _bbBankContext = BBBankContext;
            _transactionHubContext = transactionHubContext;
        }

        public async Task<LineGraphData> GetLast12MonthBalances(string? userId)
        {
            // Object to contain the line graph data
            var lineGraphData = new LineGraphData();

            // Object to contain the transactions data
            var allTransactions = new List<Transaction>();
            if (userId == null)
            {
                // if account id is NULL then fetch all transactions
                allTransactions = _bbBankContext.Transactions.ToList();
            }
            else
            {
                // if account id is not NULL then fetch all transactions for specific account id
                allTransactions = _bbBankContext.Transactions.Where(x => x.Account.User.Id == userId).ToList();
            }
            if (allTransactions.Count() > 0)
            {
                // Calculate the total balance till now
                var totalBalance = allTransactions.Sum(x => x.TransactionAmount);
                lineGraphData.TotalBalance = totalBalance;

                decimal lastMonthTotal = 0;

                // looping through last three months starting from the current
                for (int i = 12; i > 0; i--)
                {
                    // Calculate the running total balance
                    var runningTotal = allTransactions.Where(x => x.TransactionDate >= DateTime.Now.AddMonths(-i) &&
                       x.TransactionDate < DateTime.Now.AddMonths(-i + 1)).Sum(y => y.TransactionAmount) + lastMonthTotal;

                    // adding labels to line graph data for current month and year
                    lineGraphData.Labels.Add(DateTime.Now.AddMonths(-i + 1).ToString("MMM yyyy"));

                    // adding data to line graph data for current month and year
                    lineGraphData.Figures.Add(runningTotal);

                    // saving the running total for this month
                    lastMonthTotal = runningTotal;
                }
            }
            // returning the line graph data object
            return lineGraphData;
        }

        public async Task<int> DepositFunds(DepositRequest depositRequest)
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

                await _transactionHubContext.Clients.All.SendAsync("updateGraphsData", "userId123");


                return 1;
            }
        }
    }
}