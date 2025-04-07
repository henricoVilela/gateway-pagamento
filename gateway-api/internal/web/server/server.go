package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/henricoVilela/gateway-pagamento/gateway-api/internal/service"
	"github.com/henricoVilela/gateway-pagamento/gateway-api/internal/web/handlers"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	accountService *service.AccountService
	port           string
}

func NewServer(accountService *service.AccountService, port string) *Server {
	return &Server{
		router: chi.NewRouter(),
		server: &http.Server{
			Addr:    ":" + port,
			Handler: nil,
		},
		accountService: accountService,
		port:           port,
	}
}

func (s *Server) ConfigureRoutes() {
	accountHandler := handlers.NewAccountHandler(*s.accountService)
	s.router.Post("/accounts", accountHandler.Create)
	s.router.Get("/accounts", accountHandler.Get)
}

func (s *Server) Start() error {
	s.ConfigureRoutes()
	s.server.Handler = s.router
	return s.server.ListenAndServe()
}
