// script.js
// Main application logic for Google Sheets integration

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const notificationContainer = document.getElementById('notificationContainer');

    // Initialize form
    initializeForm();

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Validate form
            if (validateForm(form)) {
                // Show loading spinner
                showLoading(true);
                
                // Collect form data
                const formData = collectFormData(form);
                
                // Save to Google Sheets
                saveData(formData)
                    .then(response => {
                        if (response.success) {
                            showNotification('บันทึกข้อมูลสำเร็จ!', 'success');
                            form.reset();
                        } else {
                            throw new Error(response.message || 'บันทึกข้อมูลไม่สำเร็จ');
                        }
                    })
                    .catch(error => {
                        console.error('Save error:', error);
                        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            }
        });

        // Add real-time validation for certain fields
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmail(this.value);
            });
        }

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                validatePhone(this.value);
            });
        }
    }
});

/**
 * Initialize form with any existing data (if needed)
 */
function initializeForm() {
    // Could load existing data for editing if implementing update functionality
    // For now, we just ensure form is ready
}

/**
 * Collect all form data into an object
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data
 */
function collectFormData(form) {
    const data = {};
    const formData = new FormData(form);
    
    // Process each field
    formData.forEach((value, key) => {
        // Handle checkbox arrays (diet)
        if (key === 'diet[]') {
            if (!Array.isArray(data.diet)) {
                data.diet = [];
            }
            if (value) {
                data.diet.push(value);
            }
        } else {
            data[key] = value;
        }
    });
    
    // Convert diet array to comma-separated string
    if (Array.isArray(data.diet)) {
        data.diet = data.diet.join(', ');
    } else if (!data.diet) {
        data.diet = '';
    }
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    return data;
}

/**
 * Validate the entire form
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} True if valid
 */
function validateForm(form) {
    let isValid = true;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'กรุณากรอกข้อมูลในช่องนี้');
            isValid = false;
        }
    });

    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim()) {
        if (!validateEmail(emailField.value.trim())) {
            showError(emailField, 'กรุณากรอกอีเมลให้ถูกต้อง');
            isValid = false;
        }
    }

    // Validate phone number (Thai format: starts with 0, 8-10 digits)
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value.trim()) {
        if (!validatePhone(phoneField.value.trim())) {
            showError(phoneField, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ขึ้นต้นด้วย 0, 8-10 หลัก)');
            isValid = false;
        }
    }

    // Validate at least one dietary requirement is selected if on-site attendance
    const attendanceRadios = document.getElementsByName('attendance');
    const dietaryCheckboxes = document.getElementsByName('diet[]');
    let onsiteSelected = false;
    attendanceRadios.forEach(radio => {
        if (radio.value === 'ออนไซต์' && radio.checked) {
            onsiteSelected = true;
        }
    });

    if (onsiteSelected) {
        let dietSelected = false;
        dietaryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                dietSelected = true;
            }
        });

        if (!dietSelected) {
            // Find the first dietary checkbox to attach error
            const firstDietCheckbox = document.querySelector('input[name="diet[]"]');
            if (firstDietCheckbox) {
                showError(firstDietCheckbox, 'กรุณาเลือกอย่างน้อยหนึ่งประเภทอาหารสำหรับการเข้าร่วมแบบออนไซต์');
            }
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate Thai phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    // Thai mobile numbers: 08xxxxxxxx, 09xxxxxxxx, 06xxxxxxxx (9 or 10 digits after 0)
    const re = /^0[689]\d{7,8}$/;
    return re.test(cleaned);
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - The field element
 * @param {string} message - Error message
 */
function showError(field, message) {
    // Remove any existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error element
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#f87171';
    error.style.fontSize = '14px';
    error.style.marginTop = '5px';
    error.textContent = message;

    // Add error after the field
    field.parentNode.appendChild(error);

    // Add error styling to field
    if (field.tagName === 'SELECT' || field.tagName === 'TEXTAREA' ||
        field.type === 'text' || field.type === 'email' || field.type === 'tel' ||
        field.type === 'date') {
        field.style.borderColor = '#f87171';
        field.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 0.2)';
    }

    // For radio/checkbox groups
    if (field.type === 'radio' || field.type === 'checkbox') {
        const parent = field.parentNode;
        while (parent && !parent.classList.contains('radio-group') &&
               !parent.classList.contains('checkbox-group') &&
               !parent.isSameNode(document.body)) {
            parent = parent.parentNode;
        }
        if (parent) {
            parent.style.border = '1px solid #f87171';
            parent.style.borderRadius = '4px';
            parent.style.padding = '5px';
        }
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    // Remove all error messages
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => {
        error.remove();
    });

    // Reset field styles
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });

    // Reset group styles
    const groups = document.querySelectorAll('.radio-group, .checkbox-group');
    groups.forEach(group => {
        group.style.border = '';
        group.style.borderRadius = '';
        group.style.padding = '';
    });
}

/**
 * Show loading spinner
 * @param {boolean} show - Whether to show or hide
 */
function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type = 'info') {
    // Remove old notifications
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => {
        notif.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') {
        iconClass = 'fas fa-check-circle';
    } else if (type === 'error') {
        iconClass = 'fas fa-exclamation-triangle';
    }
    
    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    const notificationContainer = document.getElementById('notificationContainer');
    if (notificationContainer) {
        notificationContainer.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Remove after animation completes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400); // Match CSS transition duration
        }, 3500); // Show for 3.5 seconds before starting fade out
    }
}

/**
 * Save data to Google Sheets via Apps Script Web App
 * @param {Object} data - Form data to save
 * @returns {Promise<Object>} Response from server
 */
function saveData(data) {
    return fetch(window.CONFIG.SHEETS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'saveData',
            data: data
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        throw new Error('Network error: ' + error.message);
    });
}

/**
 * Load data from Google Sheets via Apps Script Web App
 * @returns {Promise<Array>} Array of data rows
 */
function loadData() {
    return fetch(window.CONFIG.SHEETS_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to load data');
        }
    })
    .catch(error => {
        throw new Error('Network error: ' + error.message);
    });
}

/**
 * Update a row in Google Sheets
 * @param {number} rowIndex - Index of row to update (1-based)
 * @param {Object} data - New data for the row
 * @returns {Promise<Object>} Response from server
 */
function updateRow(rowIndex, data) {
    return fetch(window.CONFIG.SHEETS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'updateRow',
            rowIndex: rowIndex,
            data: data
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        throw new Error('Network error: ' + error.message);
    });
}

/**
 * Delete a row from Google Sheets
 * @param {number} rowIndex - Index of row to delete (1-based)
 * @returns {Promise<Object>} Response from server
 */
function deleteRow(rowIndex) {
    return fetch(window.CONFIG.SHEETS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'deleteRow',
            rowIndex: rowIndex
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        throw new Error('Network error: ' + error.message);
    });
}