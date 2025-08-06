package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
)

type BankAccount struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	UserID    uint    `json:"user_id"`
	Owner     string  `json:"owner"`
	AccountNo string  `gorm:"unique" json:"account_no"`
	BankName  string  `json:"bank_name"`
	Balance   float64 `json:"balance"`
}

type Transaction struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `json:"user_id"`
	FromAccountID uint      `json:"from_account_id"`
	ToAccountID   uint      `json:"to_account_id"`
	Amount        float64   `json:"amount"`
	Currency      string    `json:"currency"`
	CreatedAt     time.Time `json:"created_at"`
}

var db *gorm.DB

func initDB() {
	////////////////////////////////////////////////
	hostname := os.Getenv("CHOREO_BANKINGDB_HOSTNAME")
	port := os.Getenv("CHOREO_BANKINGDB_PORT")
	username := os.Getenv("CHOREO_BANKINGDB_USERNAME")
	password := os.Getenv("CHOREO_BANKINGDB_PASSWORD")
	databasename := os.Getenv("CHOREO_BANKINGDB_DATABASENAME")
	////////////////////////////////////////////////
	if hostname == "" || port == "" || username == "" || password == "" || databasename == "" {
		log.Fatal("One or more required MySQL environment variables are not set")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&tls=skip-verify",
	username, password, hostname, port, databasename)

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	db.AutoMigrate(&BankAccount{}, &Transaction{})
}

func main() {
	initDB()
	r := gin.Default()

	r.POST("/users/:userId/accounts", createAccount)
	r.GET("/users/:userId/accounts", listAccounts)
	r.DELETE("/users/:userId/accounts/:id", deleteAccount)
	r.POST("/users/:userId/transactions", makeTransaction)
	r.GET("/users/:userId/transactions", listTransactions)

	r.Run()
}

func createAccount(c *gin.Context) {
	userID := c.Param("userId")
	var acc BankAccount
	if err := c.ShouldBindJSON(&acc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	acc.UserID = parseUint(userID)
	acc.Balance = float64(rand.Intn(4001) + 1000)
	db.Create(&acc)
	c.JSON(http.StatusCreated, acc)
}

func listAccounts(c *gin.Context) {
	userID := parseUint(c.Param("userId"))
	var accounts []BankAccount
	db.Where("user_id = ?", userID).Find(&accounts)
	if accounts == nil {
		accounts = []BankAccount{}
	}
	c.JSON(http.StatusOK, accounts)
}

func deleteAccount(c *gin.Context) {
	userID := parseUint(c.Param("userId"))
	id := c.Param("id")
	db.Where("user_id = ? AND id = ?", userID, id).Delete(&BankAccount{})
	c.Status(http.StatusNoContent)
}

func makeTransaction(c *gin.Context) {
	userID := parseUint(c.Param("userId"))

	type TransactionInput struct {
		FromAccountID uint    `json:"from_account_id"`
		AccountNo     string  `json:"account_no"`
		BankName      string  `json:"bank_name"`
		Amount        float64 `json:"amount"`
		Currency      string  `json:"currency"`
		UserID        uint    `json:"user_id"`
	}

	var input TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.Currency != "USD" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only USD is supported"})
		return
	}

	var from BankAccount
	if err := db.First(&from, "id = ? AND user_id = ?", input.FromAccountID, userID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sender account not found or not owned by user"})
		return
	}

	var to BankAccount
	if err := db.First(&to, "account_no = ? AND bank_name = ?", input.AccountNo, input.BankName).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipient account not found"})
		return
	}

	if from.Balance < input.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient funds"})
		return
	}

	var txResult Transaction
	err := db.Transaction(func(tx *gorm.DB) error {
		from.Balance -= input.Amount
		to.Balance += input.Amount

		if err := tx.Save(&from).Error; err != nil {
			return err
		}
		if err := tx.Save(&to).Error; err != nil {
			return err
		}

		txResult = Transaction{
			UserID:        userID,
			FromAccountID: from.ID,
			ToAccountID:   to.ID,
			Amount:        input.Amount,
			Currency:      input.Currency,
		}
		return tx.Create(&txResult).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
		return
	}

	c.JSON(http.StatusCreated, txResult)
}

func listTransactions(c *gin.Context) {
	userID := parseUint(c.Param("userId"))
	var txs []Transaction
	db.Where("user_id = ?", userID).Find(&txs)
	if txs == nil {
		txs = []Transaction{}
	}
	c.JSON(http.StatusOK, txs)
}

func parseUint(s string) uint {
	var id uint
	fmt.Sscanf(s, "%d", &id)
	return id
}
