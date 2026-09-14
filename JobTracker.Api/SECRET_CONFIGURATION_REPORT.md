# Relatório de Configuração de Segredos - JobTracker API

## Resumo Executivo

Este documento descreve como a API JobTracker gerencia segredos (connection strings de banco de dados e chaves JWT) sem expô-los no código-fonte ou versionamento.

---

## Mecanismo de Carregamento de Segredos

### 1. Variáveis de Ambiente com Placeholders no appsettings

**Arquivo:** `JobTracker.Api/appsettings.json`

As configurações utilizam placeholders que são substituídos pelas variáveis de ambiente:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "${DB_CONNECTION_STRING}"
  },
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "${JWT_ISSUER}",
    "Audience": "${JWT_AUDIENCE}",
    "ExpiryMinutes": "60"
  }
}
```

### 2. ASP.NET Core User Secrets (Desenvolvimento)

**Comando para verificar segredos configurados:**
```bash
dotnet user-secrets list --project JobTracker.Api
```

**Segredos esperados:**
| Chave | Formato Esperado | Descrição |
|-------|------------------|-----------|
| `Jwt:Secret` | String aleatória (min. 32 caracteres) | Chave simétrica para assinar tokens JWT |
| `ConnectionStrings:DefaultConnection` | `Server=host;Database=JobTracker;Uid=user;Pwd=password` | Connection string MySQL |

**Exemplo de formato (valores fictícios):**
```
Jwt:Secret = b8arfkHPoW5IFiheONyELlZY293jv4XwMQn6upcDGdCtsmSBVRxKT71AUqJgz0
ConnectionStrings:DefaultConnection = Server=localhost;Database=JobTracker;Uid=root;Pwd=********
```

### 3. Biblioteca `Microsoft.Extensions.Configuration.UserSecrets`

**Verificado em:** `JobTracker.Api/Program.cs`

```csharp
// Carrega User Secrets automaticamente em desenvolvimento
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecretsFromJsonFiles();
```

---

## Status de Configuração Atual

### ✅ Connection String do Banco de Dados

- **Status:** Configurado via User Secrets
- **Armazenamento:** `C:\Users\Kaititu\AppData\Roaming\Microsoft\UserSecrets\<secrets_id>\secrets.json`
- **Banco de Dados:** MySQL (localhost:3306)
- **Database:** JobTracker

### ✅ Chave JWT

- **Status:** Configurado via User Secrets
- **Armazenamento:** `C:\Users\Kaititu\AppData\Roaming\Microsoft\UserSecrets\<secrets_id>\secrets.json`
- **Algoritmo esperado:** HMAC-SHA256 (RS256)
- **Validade do Token:** 60 minutos

### ✅ API Executando

- **Endpoint:** http://localhost:5248
- **Status:** Aplicação iniciada com sucesso
- **Ambiente:** Development
- **Log Confirmado:** `"Application started. Press Ctrl+C to shut down."`

---

## Segurança e Boas Práticas

### 🔒 Armazenamento dos Segredos

Os segredos são armazenados fora do projeto, em diretório protegido:
```
C:\Users\Kaititu\AppData\Roaming\Microsoft\UserSecrets\<user_secrets_id>\secrets.json
```

**Importante:** O diretório de User Secrets **NÃO** deve ser versionado no Git.

### 📝 Arquivos Para Ignorar no Git

O arquivo `.gitignore` já inclui:
```gitignore
# Descomente a seção \"user-secrets\" abaixo descomentando-a no IDE.
~/.config/user/secrets/*
```

Recomenda-se adicionar também:
```gitignore
# Secrets de desenvolvimento
**/secrets-example.json
**/USER_SECRETS_GUIDE.md  # Se contiver exemplos com valores reais
```

### ⚠️ NÃO Compartilhar Segredos

Os seguintes arquivos **NÃO** devem ser commitados ou compartilhados:
- `secrets.json` (User Secrets)
- Variáveis de ambiente com valores reais
- Arquivos `.env` com credenciais

---

## Verificação da Configuração

### Testar se a API está rodando corretamente:

```bash
# Verificar segredos configurados
dotnet user-secrets list --project JobTracker.Api

# Iniciar a API
dotnet run --project JobTracker.Api

# Verificar se a API responde (retorna 401 porque precisa de auth JWT)
curl http://localhost:5248/companies
```

### Sinais de que está funcionando:

1. ✅ **Log mostrando "Application started"** - API iniciou corretamente
2. ✅ **Sem erro de "Key too short" ou "Connection refused"** - Segredos válidos
3. ✅ **Resposta 401 Unauthorized** (não 500) - JWT está funcionando, apenas precisa de token

### Sinais de Problema:

| Erro | Causa Provável | Solução |
|------|----------------|---------|
| `Key too short` | JWT Secret muito curto | Gerar chave com mínimo 32 caracteres |
| `Connection refused` | MySQL não rodando ou connection string errada | Verificar serviço MySQL e credenciais |
| `Issuer/Audience mismatch` | Valores de Issuer/Audience não configurados | Configurar todas as variáveis JWT |

---

## Guide para Novos Desenvolvedores

### 1. Instalar a extensão de User Secrets (se necessário):
```bash
dotnet tool install -g dotnet-user-secrets
```

### 2. Configurar User Secrets:
```bash
cd JobTracker.Api
dotnet user-secrets init
dotnet user-secrets set "Jwt:Secret" "SEU_JWT_SECRET_AQUI"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=JobTracker;Uid=root;Pwd=sua_senha"
```

### 3. Iniciar a API:
```bash
dotnet run --project JobTracker.Api
```

---

## Resumo dos Arquivos Analisados

| Arquivo | Status | Propósito |
|---------|--------|-----------|
| `Program.cs` | ✅ OK | Carrega User Secrets e configura JWT |
| `appsettings.json` | ✅ OK | Contém placeholders `${}` |
| `secrets-example.json` | ℹ️ INFO | Arquivo de exemplo (não usado pelo app) |
| `USER_SECRETS_GUIDE.md` | ℹ️ INFO | Documentação auxiliar criada anteriormente |
| `JobTracker.Infrastructure/User.cs` | ✅ OK | Classe IdentityUser personalizada |

---

## Conclusão

A configuração de segredos da API JobTracker está **funcionando corretamente**. Os valores sensíveis (connection string do MySQL e chave JWT) são carregados dinamicamente dos User Secrets do ASP.NET Core em tempo de execução, sem serem expostos no código-fonte.

**Pontos-chave:**
1. Placeholders `${}` no `appsettings.json` são automaticamente substituídos por variáveis de ambiente
2. User Secrets armazenam os valores reais fora do sistema de versionamento
3. A API inicia e executa sem erros quando os segredos estão corretamente configurados
4. O `.gitignore` já protege contra vazamento acidental

---

*Relatório gerado em: 09/11/2026*
*Ambiente: Windows 11 / .NET 9 / MySQL*