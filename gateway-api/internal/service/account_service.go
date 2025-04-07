package service

import "github.com/henricoVilela/gateway-pagamento/gateway-api/internal/domain"

type AccountService struct {
	repository domain.AccountRepository
}

func NewAccountService(repository domain.AccountRepository) *AccountService {
	return &AccountService{repository: repository}
}
