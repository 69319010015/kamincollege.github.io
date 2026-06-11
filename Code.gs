/**
 * Google Apps Script Web App for handling form data
 * Deploy as: Execute as: Me, Who has access: Anyone, even anonymous
 */

const SHEET_NAME = 'kamincollege.github.io'; // Name of the sheet to store data
const SHEET_ID = '14O1LPIsgFLm7nqHmw6kiCqkAjMBotmCHRltVKUrK734'; // Your Google Sheet ID

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Parse the incoming data from your website
    const data = JSON.parse(e.postData.contents);

    // Map the incoming data to your exact column structure
    const row = [
      new Date(), // timestamp
      data.title || '',
      data.firstname || '',
      data.lastname || '',
      data.dob || '',
      data.gender || '',
      data.organization || '',
      data.jobtitle || '',
      data.department || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.province || '',
      data.postalcode || '',
      data.attendance || '',
      data.diet || '',
      data.allergies || '',
      data.tshirt || '',
      data.terms || '',
      data.pdpa || '',
      data.newsletter || ''
    ];

    // Append the new row to the sheet
    sheet.appendRow(row);

    // Return a success response to your GitHub site
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}