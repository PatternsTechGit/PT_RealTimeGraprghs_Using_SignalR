using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace BBBankAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsService _accountsService;
        public AccountsController(IAccountsService accountsService)
        {
            _accountsService = accountsService;
        }

        [HttpGet]
        [Route("GetAccountByAccountNumber/{accountNumber}")]
        public async Task<ActionResult> GetAccountByAccountNumber(string accountNumber)
        {
            return new OkObjectResult(await _accountsService.GetAccountByAccountNumber(accountNumber));
        }
    }
}
