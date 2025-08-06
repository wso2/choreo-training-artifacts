using Microsoft.EntityFrameworkCore;
using BankingMicroservice.Models;

namespace BankingMicroservice.Data
{
    public class BankingContext : DbContext
    {
        public BankingContext(DbContextOptions<BankingContext> options) : base(options) { }

        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure table names to use snake_case
            modelBuilder.Entity<BankAccount>().ToTable("bank_accounts");
            modelBuilder.Entity<Transaction>().ToTable("transactions");
            
            // Configure column mappings for BankAccount
            modelBuilder.Entity<BankAccount>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Owner).HasColumnName("owner");
                entity.Property(e => e.AccountNo).HasColumnName("account_no").HasMaxLength(191);
                entity.Property(e => e.BankName).HasColumnName("bank_name");
                entity.Property(e => e.Balance).HasColumnName("balance").HasColumnType("decimal(10,2)");
                
                entity.HasIndex(e => e.AccountNo).IsUnique().HasDatabaseName("uni_bank_accounts_account_no");
            });
            
            // Configure column mappings for Transaction
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.FromAccountId).HasColumnName("from_account_id");
                entity.Property(e => e.ToAccountId).HasColumnName("to_account_id");
                entity.Property(e => e.Amount).HasColumnName("amount").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Currency).HasColumnName("currency");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)");
            });
            
            base.OnModelCreating(modelBuilder);
        }
    }
}