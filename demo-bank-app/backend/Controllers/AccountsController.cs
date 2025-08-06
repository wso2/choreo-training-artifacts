using Microsoft.AspNetCore.Mvc;
using BankingMicroservice.Data;
using BankingMicroservice.Models;
using System;
using System.Linq;

namespace BankingMicroservice.Controllers
{
    [ApiController]
    [Route("users/{userId}/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly BankingContext _context;
        private readonly Random _rand = new();

        public AccountsController(BankingContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateAccount(int userId, [FromBody] BankAccount acc)
        {
            acc.UserId = userId;
            acc.Balance = _rand.Next(1000, 5001);
            _context.BankAccounts.Add(acc);
            _context.SaveChanges();
            return Created(string.Empty, acc);
        }

        [HttpGet]
        public IActionResult ListAccounts(int userId)
        {
            var accounts = _context.BankAccounts.Where(a => a.UserId == userId).ToList();
            return Ok(accounts);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAccount(int userId, int id)
        {
            var account = _context.BankAccounts.FirstOrDefault(a => a.UserId == userId && a.Id == id);
            if (account == null) return NotFound();
            _context.BankAccounts.Remove(account);
            _context.SaveChanges();
            return NoContent();
        }
    }
}