# Gateway de Pagamento

Este projeto é composto por três subprojetos principais que trabalham em conjunto para criar um sistema de gateway de pagamento completo, incluindo API, validação antifraude e interface de usuário.

## Subprojetos

### 1. **gateway-api**
- **Descrição**: API desenvolvida em Go para gerenciar contas e faturas.
- **Funcionalidades**:
  - Criação de contas e geração de API Keys.
  - Criação de faturas (invoices) associadas a contas.
  - Envio de mensagens para o Kafka quando o valor da transação excede um limite pré-definido.
  - Atualização do status das faturas com base nas mensagens recebidas do Kafka.
- **Tecnologias**:
  - Go
  - PostgreSQL
  - Kafka
- **Localização**: `/gateway-api`

### 2. **nestjs-antifraud**
- **Descrição**: Serviço de validação antifraude desenvolvido em NestJS.
- **Funcionalidades**:
  - Consome mensagens do Kafka enviadas pela `gateway-api` para validar transações de alto valor.
  - Aprova ou reprova transações com base em regras de negócio.
  - Envia mensagens de volta ao Kafka com o resultado da validação.
- **Tecnologias**:
  - NestJS
  - Kafka
- **Localização**: `/nestjs-antifraud`

### 3. **next-frontend**
- **Descrição**: Interface de usuário desenvolvida em Next.js para gerenciar contas e faturas.
- **Funcionalidades**:
  - Autenticação via API Key.
  - Visualização e gerenciamento de faturas.
  - Criação de novas faturas.
- **Tecnologias**:
  - Next.js
  - TailwindCSS
- **Localização**: `/next-frontend`

## Fluxo de Trabalho

1. **Criação de Faturas**:
   - O usuário cria uma fatura através da interface do `next-frontend`.
   - A fatura é enviada para a `gateway-api`, que a processa.

2. **Validação Antifraude**:
   - Se o valor da fatura exceder um limite pré-definido, a `gateway-api` envia uma mensagem para o Kafka.
   - O serviço `nestjs-antifraud` consome a mensagem, valida a transação e envia o resultado de volta ao Kafka.

3. **Atualização do Status**:
   - A `gateway-api` consome a mensagem de resultado enviada pelo `nestjs-antifraud` e atualiza o status da fatura.

## Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/gateway-pagamento.git
   cd gateway-pagamento
   ```

2. Suba os serviços com Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Acesse os serviços:
   - **API**: `http://localhost:8080`
   - **Frontend**: `http://localhost:3000`

## Licença

Este projeto está licenciado sob a licença MIT.

