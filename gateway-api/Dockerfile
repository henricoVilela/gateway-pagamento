FROM golang:1.24

RUN apt update && \
    apt install openssl procps -y

# Criar o usuário go com diretório home
RUN useradd -m -d /home/go -s /bin/bash go

# Mudar para o usuário go
USER go

WORKDIR /home/go/app

CMD [ "tail", "-f", "/dev/null" ]

# FROM golang:1.24 as build

# WORKDIR /app

# # Copy the Go module files
# COPY go.mod .
# COPY go.sum .

# # Download the Go module dependencies
# RUN go mod download

# COPY . .

# # Compile estaticamente para evitar dependências dinâmicas
# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o myapp ./cmd/app

# FROM alpine:latest as run

# WORKDIR /app

# # Copia o executável mantendo o mesmo caminho relativo
# COPY --from=build /app/myapp .

# # Garante permissões de execução
# RUN chmod +x ./myapp

# EXPOSE 8080

# # Usa o caminho correto para o executável
# CMD ["./myapp"]