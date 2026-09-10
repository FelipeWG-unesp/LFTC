# Kit de Trabalhos

Site pessoal de ferramentas para trabalhos acadêmicos, LFTC. Primeiro módulo: **Testador de Regex**.

## Estrutura do projeto

```
regex-toolkit/
├── index.html                 ← ponto de entrada do Vite
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                ← monta o React na página
    ├── App.tsx                 ← compõe os módulos da tela
    ├── App.module.css
    ├── index.css                ← variáveis de design (cores, fontes)
    ├── types.ts                 ← tipos compartilhados (RegexFlags, TestCase, MatchStatus)
    ├── hooks/
    │   └── useRegexTester.ts    ← todo o estado e as regras de negócio
    ├── utils/
    │   └── regex.ts             ← funções puras: compilar e testar uma regex
    └── components/
        ├── Sidebar/             ← navegação lateral (preparada para novos módulos)
        ├── ExpressionField/     ← campo onde a expressão é digitada
        ├── FlagToggles/         ← botões g / i / m / s
        ├── TestList/            ← lista de testes + botão de adicionar
        ├── TestRow/             ← uma linha de teste (input + status)
        ├── StatusIcon/          ← ícone de check / x / neutro
        └── Cheatsheet/          ← referência rápida de símbolos de regex
```

Cada componente cuida de uma única responsabilidade. Toda a lógica de regex fica fora dos componentes (`utils/regex.ts` e `hooks/useRegexTester.ts`), então dá para testá-la sem precisar renderizar nada na tela.

## O que já funciona

- Campo de expressão regular com flags `g`, `i`, `m`, `s` (clicáveis)
- Lista de textos de teste — adicione ou remova quantos quiser
- Cada teste mostra na hora se a expressão aceita o texto (barra verde ✓) ou rejeita (barra vermelha ✗)
- Aviso de erro quando a expressão digitada é inválida
- Referência rápida dos símbolos de regex mais usados (aba recolhível no fim da página)
- Barra lateral já preparada para novos módulos (JSON, formatador de texto etc.)