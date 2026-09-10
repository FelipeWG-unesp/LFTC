# Kit de Trabalhos

Site pessoal de ferramentas para trabalhos acadêmicos. Primeiro módulo: **Testador de Regex**.

## Stack

- **React 19 + TypeScript** — componentes tipados
- **Vite** — servidor de desenvolvimento e build
- **CSS Modules** — cada componente tem seu próprio arquivo de estilo, sem vazar classes entre eles

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

Cada componente cuida de uma única responsabilidade. Toda a lógica de regex fica fora dos
componentes (`utils/regex.ts` e `hooks/useRegexTester.ts`), então dá para testá-la sem precisar
renderizar nada na tela.

## O que já funciona

- Campo de expressão regular com flags `g`, `i`, `m`, `s` (clicáveis)
- Lista de textos de teste — adicione ou remova quantos quiser
- Cada teste mostra na hora se a expressão aceita o texto (barra verde ✓) ou rejeita (barra vermelha ✗)
- Aviso de erro quando a expressão digitada é inválida
- Referência rápida dos símbolos de regex mais usados (aba recolhível no fim da página)
- Barra lateral já preparada para novos módulos (JSON, formatador de texto etc.)

## Como rodar localmente

Este ambiente onde eu escrevi o código não tem acesso à internet, então não consegui rodar o
`npm install` por aqui — mas no seu computador, com internet, é assim:

```bash
cd regex-toolkit
npm install
npm run dev
```

O terminal vai mostrar um endereço tipo `http://localhost:5173` — abra ele no navegador.

Outros comandos úteis:

```bash
npm run build      # gera a versão de produção na pasta dist/
npm run preview    # serve a pasta dist/ localmente, pra conferir o build
npm run typecheck  # só checa os tipos, sem gerar arquivos
```

## Como colocar no seu Git

1. Crie um repositório vazio no GitHub (ou GitLab/Bitbucket), sem README/gitignore automático.
2. No terminal, dentro da pasta `regex-toolkit`:
   ```bash
   git init
   git add .
   git commit -m "Testador de regex em React + TypeScript"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
3. (Opcional) Para publicar de graça: rode `npm run build`, depois publique a pasta `dist/`
   com o **GitHub Pages** (usando a action oficial `actions/deploy-pages`) ou com a **Vercel**/
   **Netlify**, que fazem o build sozinhas a cada push — é só conectar o repositório.

## O que eu expandiria primeiro

Em ordem de impacto:

1. **Salvar o progresso** — hoje a expressão e os testes somem ao recarregar a página. Um hook
   `useLocalStorage` simples, usado dentro de `useRegexTester`, resolve isso sem mexer em mais nada.
2. **Destacar o trecho exato que casou** dentro do texto, não só a barra inteira verde/vermelha —
   dá pra fazer com `String.matchAll` dentro de `utils/regex.ts` e um novo componente
   `HighlightedText`.
3. **Testes automatizados** para `utils/regex.ts` com Vitest — como a lógica já está isolada em
   funções puras, é rápido cobrir os casos (regex inválida, flags combinadas, string vazia).
4. **Explicação da expressão em português** — um pequeno parser que descreve cada parte do regex
   (ex.: "`[A-Z]` = uma letra maiúscula"), ótimo para estudar para prova.
5. **Novo módulo na barra lateral** — o próximo mais fácil de adicionar seguindo a mesma estrutura
   (`Conversor JSON` ou `Formatador de texto`): criar uma pasta em `components/`, um hook próprio
   se precisar de estado, e ligar a rota — hoje a Sidebar já lista os módulos futuros, só falta
   um roteador (ex.: `react-router`) para trocar de tela.
