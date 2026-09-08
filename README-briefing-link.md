# Como transformar esse briefing em um link público

O formulário HTML de briefing foi preparado para funcionar com um endpoint público, como o Google Apps Script + Google Sheets.

## Passo 1 — criar a planilha
1. Abra o Google Drive.
2. Crie uma planilha nova.
3. Nomeie como "Respostas briefing Cademolde".
4. Deixe a primeira linha com os nomes das colunas:
   - timestamp
   - Pergunta 1
   - Pergunta 2
   - Pergunta 3
   - ...
   - Observações finais

## Passo 2 — criar o Apps Script
1. Abra o Google Apps Script: https://script.google.com/
2. Crie um projeto novo.
3. Cole o conteúdo do script abaixo:

```javascript
function doGet() {
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respostas');

  if (!sheet) {
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('Respostas');
  }

  const target = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respostas');
  const headers = target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0];
  const values = [];

  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    values.push(data[key] ?? '');
  }

  target.appendRow(values);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }));
}
```

4. Salve o projeto.
5. Clique em "Implementar" > "Publicar" > "Implantar como web app".
6. Configure como:
   - Executar como: Eu
   - Quem tem acesso: Qualquer pessoa
7. Copie a URL publicada.

## Passo 3 — conectar o formulário ao Apps Script
No arquivo `briefing-cademolde-share.html`, substitua:

```javascript
const API_URL = 'https://script.google.com/macros/s/SEU_ID/exec';
```

pelo valor da URL pública que você copiou do Apps Script.

## Passo 4 — enviar o link ao cliente
Agora basta enviar o link do arquivo HTML público para o cliente. Quando ele responder, as respostas vão para a planilha vinculada ao Apps Script e você conseguirá visualizar tudo em tempo real.

## Observação importante
Se você abrir o arquivo HTML direto no navegador local, sem publicar em um endereço web, o envio pode não funcionar. A ideia é que o formulário fique acessível pela internet.

Se quiser, no próximo passo eu posso te entregar uma versão pronta com a URL já integrada ao seu ambiente e com o layout do briefing original.
