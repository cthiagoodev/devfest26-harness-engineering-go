---
name: agent-boundaries
description: Fronteiras de decisão (Core Domain vs. implementação delegada), restrições de dependências, escopo e integridade de testes em com-harness.
---

# Fronteiras do Agente (`agent-boundaries`)

Estas restrições determinam os limites operacionais do agente no repositório e não podem ser flexibilizadas.

## 1. Divisão de Responsabilidades (Core Domain vs. Implementação)

- **Decisão exclusiva do mantenedor (Core Domain):**
  - Definição de invariantes de estoque, unicidade e regras de negócio.
  - Modelagem das entidades centrais (`Lote`, `Participante`, `Ingresso`) e erros sentinela.
  - Definição e alteração de *Approved Fixtures* (cenários contratuais de comportamento).
  - É **proibido** alterar, remover ou flexibilizar *Approved Fixtures* ou critérios de aceitação para fazer testes passarem.
- **Escopo delegado ao agente (Supporting / Delivery):**
  - Implementação idiomática em Go conforme as invariantes especificadas.
  - Camada de entrega HTTP (`net/http`), serialização JSON e adaptadores de persistência em memória.
  - Suítes de testes determinísticos cobrindo integralmente as invariantes e *Approved Fixtures*.

## 2. Dependências, Escopo e Integridade

- **Dependências:** proibido executar `go get` ou adicionar módulos externos ao `go.mod` sem autorização explícita. Utilize exclusivamente a biblioteca padrão do Go.
- **Especificação estrita:** consulte `.agents/skills/business/SKILL.md` antes de implementar; não deduza ou crie regras não documentadas. Em caso de ambiguidade, interrompa e solicite definição ao mantenedor.
- **Integridade de verificação:** proibido usar `t.Skip`, relaxar asserções, ignorar erros retornados (`_ = ...`) ou reportar sucesso sem executar os sensores após a última edição.
- **Controle de versão:** proibido executar `git commit` ou `git push` sem solicitação explícita; sempre submeta o resumo técnico e os resultados dos sensores para confirmação final.
