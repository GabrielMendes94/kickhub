## KickHub
Sistema web de gerenciamento de ponto.

### Principais funcionalidades
- Telas de Login, Cadastro e Recuperação organizadas em `pages/auth/*`.
- Layout responsivo utilizando Material UI (MUI) e tema customizado (`theme/index.ts`).
- Validação de formulários com `react-hook-form` + `zod`, incluindo mensagens de erro em português.

### Stack
- Next.js 15 (Pages Router) + React 19 + TypeScript 5.
- Material UI 7 com Emotion para estilização.
- react-hook-form 7 + @hookform/resolvers + zod para validações.
- Turbopack habilitado para `dev` e `build`.

### Estrutura relevante
```
pages/
	index.tsx             # Redireciona para /auth/login
	cadastro.tsx          # Redireciona para /auth/cadastro
	recuperar-senha.tsx   # Redireciona para /auth/recuperar-senha
	auth/
		login.tsx
		cadastro.tsx
		recuperar-senha.tsx
styles/globals.css      # Reset/base global
theme/index.ts          # Tema MUI
validation/authSchemas.ts
```

### Pré-requisitos
- Node.js 20+ (compatível com Next 15).
- npm (ou pnpm/yarn se preferir, ajustando comandos).

### Scripts disponíveis
```bash
npm install             # instala dependências
npm run dev             # inicia servidor em http://localhost:3000 (Turbopack)
npm run build           # build de produção (Turbopack)
npm run start           # sobe o build gerado em modo produção
```

### Fluxo de desenvolvimento
1. Rode `npm run dev` e acesse `http://localhost:3000`.
2. Ajuste componentes dentro de `pages/auth/*` ou o tema em `theme/index.ts`.
3. Para validar formulários, edite `validation/authSchemas.ts` (as mensagens aparecem automaticamente nas telas).
4. Antes de subir alterações, execute `npm run build` para garantir que tipos e lint passam.

### Próximos passos sugeridos
- Expandir o fluxo de autenticação real integrando uma API.
- Adicionar testes (unitários ou e2e) para fluxos críticos.
- Implementar estados reais (feedbacks de loading/sucesso) nos formulários.
