using Microsoft.AspNetCore.Mvc;
using BankingMicroservice.Data;
using BankingMicroservice.Models;
using System.Linq;

namespace BankingMicroservice.Controllers
{
    [ApiController]
    [Route("users/{userId}/transactions")]
    public class TransactionsController : ControllerBase
    {
        private readonly BankingContext _context;

        public TransactionsController(BankingContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult MakeTransaction(int userId, [FromBody] TransactionInput input)
        {
            if (input.Currency != "USD")
                return BadRequest(new { error = "only usd is supported" });

            var from = _context.BankAccounts.FirstOrDefault(a => a.Id == input.FromAccountId && a.UserId == userId);
            if (from == null) return BadRequest(new { error = "sender account not found or not owned by user" });

            var to = _context.BankAccounts.FirstOrDefault(a => a.AccountNo == input.AccountNo && a.BankName == input.BankName);
            if (to == null) return BadRequest(new { error = "recipient account not found" });

            if (from.Balance < input.Amount)
                return BadRequest(new { error = "insufficient funds" });

            var tx = new Transaction
            {
                UserId = userId,
                FromAccountId = from.Id,
                ToAccountId = to.Id,
                Amount = input.Amount,
                Currency = input.Currency
            };

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                from.Balance -= input.Amount;
                to.Balance += input.Amount;
                _context.SaveChanges();

                _context.Transactions.Add(tx);
                _context.SaveChanges();

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                return StatusCode(500, new { error = "transaction failed" });
            }

            return Created(string.Empty, tx);
        }

        [HttpGet]
        public IActionResult ListTransactions(int userId)
        {
            var txs = _context.Transactions.Where(t => t.UserId == userId).ToList();
            return Ok(txs);
        }
    }
}