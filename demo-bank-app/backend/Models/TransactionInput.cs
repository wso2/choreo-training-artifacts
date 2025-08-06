using System.Text.Json.Serialization;

namespace BankingMicroservice.Models
{
    public class TransactionInput
    {
        [JsonPropertyName("from_account_id")]
        public int FromAccountId { get; set; }
        
        [JsonPropertyName("account_no")]
        public string AccountNo { get; set; } = string.Empty;
        
        [JsonPropertyName("bank_name")]
        public string BankName { get; set; } = string.Empty;
        
        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
        
        [JsonPropertyName("currency")]
        public string Currency { get; set; } = string.Empty;
        
        [JsonPropertyName("user_id")]
        public int UserId { get; set; }
    }
}