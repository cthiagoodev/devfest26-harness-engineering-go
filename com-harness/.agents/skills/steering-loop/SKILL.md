---
name: steering-loop
description: Ciclo TDD (testes primeiro), endurecimento contínuo de guias/sensores e formato estruturado de erros para autocorreção determinística.
---

# Steering Loop e Sinais Estruturados

Todo ciclo de implementação ou correção em `com-harness/` deve operar em malha fechada até que todos os sensores determinísticos passem.

## 1. Fluxo de Execução

1. **Leitura de especificações:** consultar `agent-boundaries`, `architecture` e `business` antes de editar código.
2. **Testes primeiro (TDD):** escrever os testes de unidade e *Approved Fixtures* antes da implementação (`tests/SKILL.md`).
3. **Implementação mínima:** implementar apenas o código necessário nas camadas definidas.
4. **Validação na CPU:** executar `gofmt -l .`, `go vet ./...` e `go test -race -v ./...` em ciclo iterativo até obter código de saída `0` em todas as etapas.
5. **Endurecimento de guias e sensores:** diante de falhas recorrentes ou ambiguidades de especificação, atualizar a `SKILL.md` correspondente ou adicionar validação estrutural (`*_test.go` / `arch_test.go`) para prevenir recorrência.

## 2. Formato de Sinais para Autocorreção

Sensores estruturais e validações customizadas devem emitir mensagens de falha estruturadas em três campos objetivos para orientar a correção determinística:

```text
PROBLEMA: <descrição objetiva da violação, arquivo e símbolo afetado>
REGRA VIOLADA: <invariante de domínio ou restrição arquitetural infringida>
AÇÃO DE CORREÇÃO: <alteração técnica necessária para restaurar a conformidade>
```
