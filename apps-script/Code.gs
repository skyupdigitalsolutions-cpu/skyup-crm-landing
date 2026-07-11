// ============================================================
// Skyup CRM landing page — lead intake Web App
//
// Setup:
// 1. Open the target Google Sheet:
//    https://docs.google.com/spreadsheets/d/1-ZigHe9r1DV_OfHWRSK2w1Pv2ddYAQkq3vViB1wWiDI/edit
// 2. Extensions > Apps Script
// 3. Delete any placeholder code and paste this whole file
// 4. Deploy > New deployment > type: Web app
//      Execute as: Me
//      Who has access: Anyone
// 5. Copy the Web app URL it gives you
// 6. Paste that URL into src/config.js as CONFIG.FORM_ENDPOINT
//
// Re-deploying after edits: Deploy > Manage deployments > edit (pencil) >
// New version > Deploy — the URL stays the same.
// ============================================================

var SHEET_NAME = 'Leads'

function doPost(e) {
  var sheet = getOrCreateSheet_()
  var data = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.business_type || '',
    data.city || '',
    data.source || '',
    data.page || '',
    data.ts || '',
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(['Received At', 'Name', 'Phone', 'Business Type', 'City', 'Source', 'Page', 'Client Timestamp'])
    sheet.setFrozenRows(1)
  }
  return sheet
}
