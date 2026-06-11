# Kamin College Registration Form

A modern, beautiful web form with Google Sheets integration that requires no Google Cloud dependencies. Features glassmorphism design, smooth animations, dark mode, and seamless data storage to Google Sheets via Apps Script Web App.

## Features

- **Glassmorphism Design**: Beautiful frosted glass effects with gradient borders
- **Smooth Animations**: Fade-in, hover glow, pulse effects, floating legends
- **Dark Mode**: Built-in dark theme with auto-adjusting colors
- **Form Validation**: Real-time validation with animated error messages
- **Notifications**: Success/error alerts with smooth transitions
- **Loading States**: Visual feedback during data submission
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Google Sheets Integration**: Store form data directly to Google Sheets
- **No Backend Required**: Uses Google Apps Script as a lightweight web app

## Files

- `index.html` - Main HTML structure
- `style.css` - Glassmorphism design and animations
- `script.js` - Form logic, validation, and Google Sheets communication
- `config.js` - Configuration (Apps Script URL)
- `Code.gs` - Google Apps Script backend (deploy as web app)
- `GOOGLE_SHEETS_SETUP.md` - Detailed setup instructions
- `README.md` - This file

## Setup Instructions

See `GOOGLE_SHEETS_SETUP.md` for complete step-by-step instructions on:
1. Creating the Google Sheet with proper column headers
2. Setting up the Apps Script project
3. Deploying as a web app
4. Configuring the application
5. Testing the integration

## Usage

1. Fill out the form with your information
2. Click "ส่งแบบฟอร์มลงทะเบียน" (Submit Registration Form)
3. View success notification
4. Check your Google Sheet to see the stored data

## Customization

- Modify `config.js` to change the Apps Script endpoint
- Adjust styles in `style.css` for different themes
- Update form fields in `index.html` and corresponding logic in `script.js`
- Modify column mapping in `Code.gs` if changing sheet structure

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge) with CSS animations and ES6+ support.

## Notes

- The Apps Script web app must be deployed with "Anyone, even anonymous" access
- No authentication or Google Cloud project required
- Data is appended to the sheet as new rows
- Timestamps are automatically added in ISO format