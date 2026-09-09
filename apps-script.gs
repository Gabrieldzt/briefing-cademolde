const SPREADSHEET_ID = '1Ep94UgkX60ha5E_30b7aO3DMgsPFtBKoamedhYni4Y0';

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'COLE_AQUI_O_ID_DA_PLANILHA') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }

  throw new Error('Nenhuma planilha vinculada. Configure o SPREADSHEET_ID no Apps Script.');
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Briefing ativo.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const rawBody = e.postData && e.postData.contents ? e.postData.contents : '{}';
    let payload = {};

    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      payload = {};
      if (rawBody && rawBody.trim()) {
        try {
          payload = JSON.parse(rawBody.replace(/^\s*\{/, '{').replace(/\}\s*$/, '}'));
        } catch (fallbackError) {
          payload = { rawBody };
        }
      }
    }

    if (!payload || Object.keys(payload).length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, message: 'Nenhum dado recebido.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const spreadsheet = getSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Respostas');

    if (!sheet) {
      sheet = spreadsheet.insertSheet('Respostas');
    }

    const keys = Object.keys(payload);
    const headers = sheet.getRange(1, 1, 1, Math.max(keys.length, 1)).getValues()[0];

    if (!headers || headers.every(h => h === '')) {
      sheet.appendRow(keys);
    } else {
      const existing = headers.filter(h => h !== '');
      const missing = keys.filter(key => !existing.includes(key));
      if (missing.length > 0) {
        const nextCol = existing.length + 1;
        sheet.getRange(1, nextCol, 1, missing.length).setValues([missing]);
      }
    }

    const finalHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = finalHeaders.map(header => payload[header] ?? '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, received: Object.keys(payload).length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
