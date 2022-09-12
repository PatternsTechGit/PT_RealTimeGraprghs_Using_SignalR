using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class TransactionHUB : Hub
    {
        public async Task Send()
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("updateGraphsData");
        }
    }
}
