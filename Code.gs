/**
 * Google Apps Script Web App for handling form data
 * Deploy as: Execute as: Me, Who has access: Anyone, even anonymous
 */

const SHEET_NAME = 'Form Responses'; // Name of the sheet to store data
const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your Google Sheet ID

/**
 * Handle GET requests (for loadData)
 * @param {Object} e - Event object
 * @returns {JsonResponse} JSON response with data
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle POST requests (for saveData, updateRow, deleteRow)
 * @param {Object} e - Event object
 * @returns {JsonResponse} JSON response
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler
 * @param {Object} e - Event object
 * @returns {JsonResponse} JSON response
 */
function handleRequest(e) {
  try {
    const params = e.parameter;
    const action = params.action || 'saveData'; // Default to saveData
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return JSON.stringify({ success: false, message: 'Sheet not found' });
    }
    
    let result;
    
    switch (action) {
      case 'saveData':
        const data = JSON.parse(e.postData.contents).data;
        result = saveData(sheet, data);
        break;
      case 'updateRow':
        const updateData = JSON.parse(e.postData.contents);
        result = updateRow(sheet, updateData.rowIndex, updateData.data);
        break;
      case 'deleteRow':
        const deleteData = JSON.parse(e.postData.contents);
        result = deleteRow(sheet, deleteData.rowIndex);
        break;
      default:
        result = { success: false, message: 'Invalid action' };
    }
    
    return JSON.stringify(result);
  } catch (error) {
    return JSON.stringify({ success: false, message: error.toString() });
  }
}

/**
 * Save data to the sheet (append new row)
 * @param {Sheet} sheet - Google Sheet object
 * @param {Object} data - Form data object
 * @returns {Object} Result object
 */
function saveData(sheet, data) {
  // Define the column order matching the form
  const columns = [
    'timestamp', 'title', 'firstname', 'lastname', 'dob', 'gender', 
    'organization', 'jobtitle', 'department', 'email', 'phone', 'address', 
    'province', 'postalcode', 'attendance', 'diet', 'allergies', 'tshirt', 
    'terms', 'pdpa', 'newsletter'
  ];
  
  // Create row array in column order
  const row = columns.map(col => {
    // Handle checkbox array (diet) - already converted to string in collectFormData
    return data[col] !== undefined ? data[col] : '';
  });
  
  // Append row
  sheet.appendRow(row);
  
  return { success: true, message: 'Data saved successfully' };
}

/**
 * Update a row in the sheet
 * @param {Sheet} sheet - Google Sheet object
 * @param {number} rowIndex - 1-based row index to update
 * @param {Object} data - Form data object
 * @returns {Object} Result object
 */
function updateRow(sheet, rowIndex, data) {
  // Define the column order matching the form
  const columns = [
    'timestamp', 'title', 'firstname', 'lastname', 'dob', 'gender', 
    'organization', 'jobtitle', 'department', 'email', 'phone', 'address', 
    'province', 'postalcode', 'attendance', 'diet', 'allergies', 'tshirt', 
    'terms', 'pdpa', 'newsletter'
  ];
  
  // Create row array in column order
  const row = columns.map(col => {
    return data[col] !== undefined ? data[col] : '';
  });
  
  // Update row
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  
  return { success: true, message: 'Data updated successfully' };
}

/**
 * Delete a row from the sheet
 * @param {Sheet} sheet - Google Sheet object
 * @param {number} rowIndex - 1-based row index to delete
 * @returns {Object} Result object
 */
function deleteRow(sheet, rowIndex) {
  sheet.deleteRow(rowIndex);
  return { success: true, message: 'Data deleted successfully' };
}

/**
 * Helper function to get all data as array of objects (for loadData)
 * @param {Sheet} sheet - Google Sheet object
 * @returns {Array} Array of data objects
 */
function getAllData(sheet) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length === 0) return [];
  
  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    const rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = rows[i][j];
    }
    data.push(rowObj);
  }
  
  return data;
}