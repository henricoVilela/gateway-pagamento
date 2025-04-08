package dto

import "github.com/henricoVilela/gateway-pagamento/gateway-api/internal/domain"

type CreateAccountInput struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type AccountOutput struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Balance   float64 `json:"balance"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	APIKey    string  `json:"api_key,omitempty"`
}

func ToAccount(input CreateAccountInput) *domain.Account {
	return domain.NewAccount(input.Name, input.Email)
}

func FromAccount(account *domain.Account) *AccountOutput {
	return &AccountOutput{
		ID:        account.ID,
		Name:      account.Name,
		Email:     account.Email,
		Balance:   account.Balance,
		APIKey:    account.APIKey,
		CreatedAt: account.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: account.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}
