# Briefing Cademolde

## Configuração GitHub Pages

### Passo 1 — Subir o projeto para o GitHub
O repositório já está pronto para ser publicado.

### Passo 2 — Ativar o Pages
Dentro do repositório:

1. Clique em Settings
2. Vá em Pages
3. Em Branch, escolha a branch principal
4. Clique em Save

O GitHub vai gerar um link parecido com:

https://gabrieldzt.github.io/briefing-cademolde/

### Passo 3 — Enviar esse link ao cliente
Você envia a URL do GitHub Pages para o cliente responder.

### Passo 4 — Manter a coleta no Apps Script
O formulário continua mandando as respostas para:

https://script.google.com/macros/s/AKfycbwi3dADa8dXojrLWFOlfvj0ECVOt5zIyfePIeyRYryMMS3diNeSERUWFTEoS9Yx78p2Bw/exec

Isso garante que:
- O cliente vê o formulário visualmente
- As respostas vão para a planilha

## Observação
O GitHub Pages serve arquivos estáticos. O backend fica no Apps Script, que recebe as respostas publicamente.
