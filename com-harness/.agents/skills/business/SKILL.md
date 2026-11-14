---
name: business
description: Linguagem Ubíqua (PT-BR), as 5 invariantes inegociáveis e Approved Fixtures do Sistema de Emissão e Check-in de Ingressos (DevFest).
---

# Regras de Negócio — Emissão e Check-in de Ingressos (DevFest)

Consulte esta skill **antes de qualquer alteração**. As regras abaixo são 100% decisão humana.

## 1. Linguagem Ubíqua Obrigatória (PT-BR)

- `Lote`: conjunto limitado de vagas para o evento (ex.: Lote 1 — 10 ingressos).
- `Participante`: pessoa que solicita o ingresso (`Nome`, `CPF`, `Email`).
- `Ingresso`: título emitido para um `Participante`, com `ID` único e imutável, dados do titular, `StatusIngresso` (`Emitido` ou `Utilizado`) e horário da entrada.
- `EmitirIngresso`: valida todas as invariantes do `Lote` e emite um novo `Ingresso`.
- `RegistrarEntrada(ingressoID)`: realiza o check-in na portaria.

## 2. As 5 Invariantes Inegociáveis

1. **Estoque limitado:** cada `Lote` tem capacidade máxima fixa e o saldo de vagas nunca fica negativo, mesmo sob concorrência (`sync.Mutex`). Sem vagas, retorna `ErrLoteEsgotado`.
2. **Unicidade por CPF e E-mail:** máximo de **1 ingresso por CPF e 1 ingresso por E-mail** no mesmo lote. Se o `CPF` ou o `Email` já possuir ingresso emitido naquele lote, retorna `ErrParticipanteJaInscrito`.
3. **ID Único:** todo `Ingresso` emitido recebe automaticamente um `ID` único e imutável.
4. **Intransferibilidade:** o ingresso é pessoal e intransferível. É estritamente proibido criar métodos, funções ou endpoints para alterar o titular (`Nome`, `CPF` ou `Email`).
5. **Check-in Único (`RegistrarEntrada`):** marca o ingresso como `Utilizado` uma única vez e registra o horário da entrada; segunda tentativa retorna `ErrIngressoJaUtilizado` e `IngressoID` inexistente retorna `ErrIngressoNaoEncontrado`.

## 3. Approved Fixtures (Cenários Obrigatórios de Comportamento)

Estes cenários formam o contrato imutável de comportamento; o agente **nunca** deve alterá-los ou enfraquecê-los:

| Cenário | Entrada / Condição | Resultado Esperado |
| :--- | :--- | :--- |
| **Estresse concorrente de estoque** | Lote com capacidade `10` + `50` goroutines chamando `EmitirIngresso` simultaneamente | Exatamente `10` ingressos `Emitido` e `40` erros `ErrLoteEsgotado` |
| **Duplicidade por CPF** | Mesmo `CPF` com `Email` diferente no mesmo `Lote` | Bloqueado com `ErrParticipanteJaInscrito` |
| **Duplicidade por E-mail** | Mesmo `Email` com `CPF` diferente no mesmo `Lote` | Bloqueado com `ErrParticipanteJaInscrito` |
| **Check-in único e duplicado** | 1ª e 2ª chamada de `RegistrarEntrada` para o mesmo `IngressoID` | 1ª muda para `Utilizado` com horário; 2ª retorna `ErrIngressoJaUtilizado` |
| **Ingresso inexistente** | `RegistrarEntrada` com `IngressoID` desconhecido | Retorna `ErrIngressoNaoEncontrado` |
| **Intransferibilidade** | Inspeção de API pública e endpoints HTTP | Ausência total de métodos ou rotas de transferência de titularidade |
