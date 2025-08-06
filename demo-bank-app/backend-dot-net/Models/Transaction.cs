using System;
using System.Text.Json.Serialization;

namespace BankingMicroservice.Models
{
    public class Transaction
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        
        [JsonPropertyName("user_id")]
        public int UserId { get; set; }
        
        [JsonPropertyName("from_account_id")]
        public int FromAccountId { get; set; }
        
        [JsonPropertyName("to_account_id")]
        public int ToAccountId { get; set; }
        
        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
        
        [JsonPropertyName("currency")]
        public string Currency { get; set; } = string.Empty;
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}