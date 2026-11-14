# AGENTS.md — com-harness

Módulo: `devfest2026/com-harness` (Go 1.27.4, biblioteca padrão apenas, sem dependências externas).

## Arquitetura do Harness

- **Feedforward (Guias):** especificações de domínio, fronteiras de pacotes e contratos de comportamento consultados antes da escrita de código.
- **Feedback (Sensores):** validações determinísticas executadas na CPU (`gofmt`, `go vet`, análise estática via `go/ast` e `go test -race`) após cada alteração.

## Skills (`.agents/skills/`)

Consulte sob demanda antes de planejar ou alterar código:

- `agent-boundaries/SKILL.md` — Fronteiras de decisão (Core Domain vs. implementação delegada), restrições de escopo e dependências.
- `architecture/SKILL.md` — Isolamento de pacotes (*Bounded Contexts*), regras de manutenibilidade e sensor estrutural (`arch_test.go`).
- `business/SKILL.md` — Linguagem Ubíqua, invariantes de domínio e *Approved Fixtures*.
- `steering-loop/SKILL.md` — Ciclo TDD, evolução de guias/sensores e formato estruturado de erros de validação.
- `tests/SKILL.md` — *Keep Quality Left* e pipeline de verificação determinística na CPU.
