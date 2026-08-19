# Bússola Gastos

App de controle financeiro pessoal (gastos, entradas, saldo por forma de pagamento, gráficos por categoria e calendário), com **login por conta** — cada pessoa que acessa o link só vê os próprios dados, guardados na nuvem.

## Como funciona

- **Login**: e-mail/senha ou Google (Firebase Authentication).
- **Dados**: salvos no Firestore, um documento por usuário (`users/{uid}`) — ninguém acessa os dados de outra pessoa.
- **Publicação**: um único arquivo estático (`index.html`), pronto para GitHub Pages.

## Passo 1 — Criar o projeto Firebase (grátis)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e clique em **Adicionar projeto**. Dê um nome (ex: `bussola-gastos`) e conclua a criação.
2. No menu lateral, vá em **Build → Authentication → Get started**.
   - Na aba **Sign-in method**, ative **E-mail/senha**.
   - Ative também **Google** (opcional, mas recomendado — login em 1 clique).
3. Vá em **Build → Firestore Database → Create database**.
   - Escolha **modo produção** e a região mais próxima (ex: `europe-west`).
4. Ainda no Firestore, vá na aba **Regras** e cole:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
   Isso garante que cada pessoa só lê/escreve o próprio documento. Clique em **Publicar**.
5. Volte à **Visão geral do projeto** (ícone de casa) → clique no ícone **`</>`** (Web) para registrar um app web.
   - Dê um apelido (ex: `bussola-web`) e clique em **Registrar app**.
   - Copie o objeto `firebaseConfig` mostrado na tela — algo assim:
     ```js
     const firebaseConfig = {
       apiKey: "AIza...",
       authDomain: "bussola-gastos-xxxx.firebaseapp.com",
       projectId: "bussola-gastos-xxxx",
       storageBucket: "bussola-gastos-xxxx.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef"
     };
     ```

## Passo 2 — Colar a configuração no app

Abra `index.html`, procure por `firebaseConfig` (perto do topo do `<script type="module">`) e substitua os valores de exemplo pelos que você copiou no passo anterior.

## Passo 3 — Publicar no GitHub Pages

1. Envie o arquivo para o GitHub (`git add`, `git commit`, `git push`).
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha a branch `main` e a pasta `/ (root)`. Salve.
4. Em alguns minutos o site estará disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Esse é o link que outras pessoas usam para acessar o app, criar sua própria conta e registrar seus próprios gastos — os dados de cada uma ficam isolados na conta dela.

## Domínios autorizados (importante)

No Firebase, vá em **Authentication → Settings → Domínios autorizados** e adicione o domínio do GitHub Pages (ex: `seu-usuario.github.io`), senão o login trava com erro de domínio não autorizado.
