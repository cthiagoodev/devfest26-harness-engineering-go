---
name: architecture
description: Isolamento de Bounded Contexts (internal/dominio puro e internal/httpapi), limites de manutenibilidade e validação estrutural via go/ast.
---

# Arquitetura e Manutenibilidade

O projeto utiliza exclusivamente a biblioteca padrão do Go (`net/http`, `encoding/json`, `sync`, etc.), sem bibliotecas externas.

## 1. Bounded Contexts e Direção de Dependência

- **`internal/dominio` (Core Domain):**
  - Contém entidades, invariantes, erros sentinela e lógica de negócio.
  - **Proibido** importar `net/http`, `encoding/json`, `database/sql` ou pacotes externos.
- **`internal/httpapi` (Camada de Entrega HTTP):**
  - Handlers `net/http` responsáveis apenas por decodificação/codificação JSON, mapeamento de status HTTP e delegação ao pacote `dominio`.
- **`cmd/api/main.go`:**
  - Ponto de entrada para composição de dependências e inicialização do `http.Server`.

## 2. Manutenibilidade e Legibilidade

- **Fluxo explícito:** utilize *early returns*, nomes aderentes à Linguagem Ubíqua e tratamento explícito de todos os erros retornados (proibido `_ = err`).
- **Erros sentinela:** falhas de regra de negócio devem ser representadas por erros sentinela exportados e verificáveis via `errors.Is`.
- **Tamanho máximo de função:** funções em `internal/dominio` não devem ultrapassar **45 linhas**; extraia funções auxiliares coesas quando necessário.

## 3. Sensor Estrutural (`arch_test.go`)

O pacote `internal/dominio` deve manter `arch_test.go` utilizando `go/parser` e `go/ast` para validar automaticamente em tempo de teste:
1. Ausência de imports proibidos (`net/http`, `encoding/json`, `database/sql`) nos arquivos de produção do pacote.
2. Conformidade de todas as funções do pacote com o limite máximo de **45 linhas**.
