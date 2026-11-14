# DevFest Fortaleza 2026 — Harness Engineering com Go e Antigravity

Bem-vindo(a)! Este é o repositório oficial com o material de apoio e o código prático da palestra apresentada por **Thiago Sousa** (Desenvolvedor Mobile no Banco BV e fundador da comunidade **Mobile Devs Ceará**).

Aqui você encontra a comparação direta entre programar com IA "sem rédeas" e aplicar um **Harness** simples para ganhar confiança e velocidade no dia a dia.

## O que tem por aqui

- 🎨 **`apresentacao/`** — Slides interativos em HTML/CSS com animações.
- 🎲 **`sem-harness/`** — O resultado de pedir código à IA no modo *Vibe Coding* (sem regras).
- 🛡️ **`com-harness/`** — O mesmo desafio resolvido com `AGENTS.md` + validações automáticas em Go.

## Como testar rápido

**1. Ver os slides:** abra o arquivo HTML da pasta `apresentacao/` direto no seu navegador.

**2. Rodar os testes em Go:**

```bash
# Projeto sem Harness
cd sem-harness && go test ./...

# Projeto com Harness
cd ../com-harness && go test ./...
```

## Referência e comunidade

- 📖 **Artigo base:** [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html), por Birgitta Böckeler (MartinFowler.com).

Curtiu o conteúdo? Fique à vontade para clonar, testar os dois cenários, abrir uma *issue* com dúvidas ou sugestões e trocar uma ideia comigo no **GitHub** ou no **LinkedIn**!
