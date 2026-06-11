// config.js
// Configuration for Google Sheets Apps Script Web App URL
// Replace the URL with your own deployed Apps Script Web App URL
// To deploy: In Google Sheets, go to Extensions > Apps Script, then publish as web app.

// Attach configuration to window object for global access
window.CONFIG = {
  // Google Sheets Apps Script Web App endpoint (must be set to accept GET and POST requests)
  SHEETS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxdaZ5164Zcb3K3LeklpiSQ3_-nX2spmGxRS9ODEnONUfTEtKxJmITlvN4KEugc7UX-Qw/exec',

  // Application settings
  APP_NAME: 'Kamin College Data Manager',
  VERSION: '1.0.0'
};