---
name: tests
description: Behaviour Harness e Keep Quality Left — pirâmide de sensores computacionais na CPU (gofmt, go vet, go test -race) e testes estruturais.
---

# Behaviour Harness & Keep Quality Left

Priorize sempre **sensores computacionais na CPU** (execução em milissegundos, determinísticos, custo zero de tokens) antes de qualquer revisão manual ou inferencial.

## 1. Princípio *Keep Quality Left* & TDD

- Escreva os **testes de unidade antes da implementação** usando apenas `testing` (e `net/http/httptest` para `internal/httpapi`), sem frameworks externos.
- Cubra obrigatoriamente todas as **5 invariantes** e os **Approved Fixtures** definidos em `.agents/skills/business/SKILL.md`.
- Nunca ignore erros (`_ = ...`), nunca use `t.Skip` e nunca relaxe *assertions*.

## 2. Pipeline de Verificação Obrigatória (da esquerda para a direita)

Execute na ordem do menor para o maior custo computacional a cada alteração:

1. **Formatação e análise estática (CPU em ms):**
   ```bash
   test -z "$(gofmt -l .)"
   go vet ./...
   ```
2. **Sensores arquiteturais (`go/ast`):**
   ```bash
   go test -run TestArquitetura ./...
   ```
3. **Sensores comportamentais e concorrência (CPU + `-race`):**
   ```bash
   go test -race -v ./...
   ```
   Deve incluir *table-driven tests* cobrindo todas as 5 invariantes e teste de estresse concorrente com *goroutines* validando o limite rígido de estoque.
