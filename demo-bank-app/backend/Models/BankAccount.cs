using System.Text.Json.Serialization;

namespace BankingMicroservice.Models
{
    public class BankAccount
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        
        [JsonPropertyName("user_id")]
        public int UserId { get; set; }
        
        [JsonPropertyName("owner")]
        public string Owner { get; set; } = string.Empty;
        
        [JsonPropertyName("account_no")]
        public string AccountNo { get; set; } = string.Empty;
        
        [JsonPropertyName("bank_name")]
        public string BankName { get; set; } = string.Empty;
        
        [JsonPropertyName("balance")]
        public decimal Balance { get; set; }
    }
}