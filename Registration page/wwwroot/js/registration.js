/**
 * Troywings Technologies Registration Page JavaScript
 * Handles form validation, animations, and user interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // FORM ELEMENTS
    // ===================================

    const registrationForm = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const fatherNameInput = document.getElementById('fatherName');
    const dobInput = document.getElementById('dob');
    const emailInput = document.getElementById('email');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const termsCheckbox = document.getElementById('terms');

    // Error message elements
    const fullNameError = document.getElementById('fullNameError');
    const fatherNameError = document.getElementById('fatherNameError');
    const dobError = document.getElementById('dobError');
    const emailError = document.getElementById('emailError');
    const addressError = document.getElementById('addressError');
    const phoneError = document.getElementById('phoneError');

    // ===================================
    // FORM SUBMISSION HANDLING
    // ===================================

    if (registrationForm) {
        registrationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            clearAllErrors();

            // Validate all fields
            let isValid = true;

            // Validate Full Name
            if (!validateFullName()) {
                isValid = false;
            }

            // Validate Father's Name
            if (!validateFatherName()) {
                isValid = false;
            }

            // Validate Date of Birth
            if (!validateDOB()) {
                isValid = false;
            }

            // Validate Email
            if (!validateEmail()) {
                isValid = false;
            }

            // Validate Address
            if (!validateAddress()) {
                isValid = false;
            }

            // Validate Phone (optional but if provided, must be valid)
            if (phoneInput.value && !validatePhone()) {
                isValid = false;
            }

            // Validate Terms
            if (!termsCheckbox.checked) {
                showNotification('Please accept the Terms & Conditions', 'error');
                isValid = false;
            }

            // If all validations pass, submit the form
            if (isValid) {
                submitForm();
            }
        });
    }

    // ===================================
    // VALIDATION FUNCTIONS
    // ===================================

    function validateFullName() {
        const value = fullNameInput.value.trim();

        if (!value) {
            showError(fullNameInput, fullNameError, 'Full name is required');
            return false;
        }

        if (value.length < 3) {
            showError(fullNameInput, fullNameError, 'Name must be at least 3 characters');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fullNameInput, fullNameError, 'Name should only contain letters');
            return false;
        }

        showSuccess(fullNameInput, fullNameError);
        return true;
    }

    function validateFatherName() {
        const value = fatherNameInput.value.trim();

        if (!value) {
            showError(fatherNameInput, fatherNameError, "Father's name is required");
            return false;
        }

        if (value.length < 3) {
            showError(fatherNameInput, fatherNameError, 'Name must be at least 3 characters');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fatherNameInput, fatherNameError, 'Name should only contain letters');
            return false;
        }

        showSuccess(fatherNameInput, fatherNameError);
        return true;
    }

    function validateDOB() {
        const value = dobInput.value;

        if (!value) {
            showError(dobInput, dobError, 'Date of birth is required');
            return false;
        }

        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18) {
            showError(dobInput, dobError, 'You must be at least 18 years old');
            return false;
        }

        if (age > 100) {
            showError(dobInput, dobError, 'Please enter a valid date of birth');
            return false;
        }

        showSuccess(dobInput, dobError);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();

        if (!value) {
            showError(emailInput, emailError, 'Email address is required');
            return false;
        }

        if (!isValidEmail(value)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }

        showSuccess(emailInput, emailError);
        return true;
    }

    function validateAddress() {
        const value = addressInput.value.trim();

        if (!value) {
            showError(addressInput, addressError, 'Address is required');
            return false;
        }

        if (value.length < 10) {
            showError(addressInput, addressError, 'Please enter a complete address (minimum 10 characters)');
            return false;
        }

        showSuccess(addressInput, addressError);
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();

        // Phone is optional, but if provided, must be valid
        if (value) {
            // Remove all non-digit characters for validation
            const digitsOnly = value.replace(/\D/g, '');

            if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                showError(phoneInput, phoneError, 'Please enter a valid phone number');
                return false;
            }
        }

        showSuccess(phoneInput, phoneError);
        return true;
    }

    // ===================================
    // REAL-TIME VALIDATION
    // ===================================

    fullNameInput.addEventListener('blur', validateFullName);
    fatherNameInput.addEventListener('blur', validateFatherName);
    dobInput.addEventListener('blur', validateDOB);
    emailInput.addEventListener('blur', validateEmail);
    addressInput.addEventListener('blur', validateAddress);
    phoneInput.addEventListener('blur', validatePhone);

    // ===================================
    // INPUT ANIMATIONS & INTERACTIONS
    // ===================================

    const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea');

    allInputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        // Blur animation
        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Input animation
        input.addEventListener('input', function () {
            // Clear error on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    });

    // ===================================
    // PHONE NUMBER FORMATTING
    // ===================================

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value.length <= 10) {
                // Format as: XXXXX XXXXX
                value = value.replace(/(\d{5})(\d{1,5})/, '$1 $2');
            } else {
                // Format as: +XX XXXXX XXXXX
                value = value.replace(/(\d{2})(\d{5})(\d{1,5})/, '+$1 $2 $3');
            }
        }

        e.target.value = value.trim();
    });

    // ===================================
    // FORM SUBMISSION
    // ===================================

    function submitForm() {
        const btn = registrationForm.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('.btn-icon');

        // Add loading state
        btn.classList.add('loading');
        btnText.style.opacity = '0';
        btnIcon.style.opacity = '0';

        // Collect form data
        const formData = {
            fullName: fullNameInput.value.trim(),
            fatherName: fatherNameInput.value.trim(),
            dateOfBirth: dobInput.value,
            email: emailInput.value.trim(),
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim() || null
        };

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Remove loading state
            btn.classList.remove('loading');
            btnText.style.opacity = '1';
            btnIcon.style.opacity = '1';

            // Log form data (for demo purposes)
            console.log('Registration Data:', formData);

            // Show success message
            showNotification('Registration successful! Welcome to Troywings Technologies.', 'success');

            // In production, redirect to dashboard or success page
            // window.location.href = '/dashboard';

            // For demo, reset form after 2 seconds
            setTimeout(() => {
                registrationForm.reset();
                clearAllErrors();
            }, 2000);
        }, 2500);
    }

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    function showError(input, errorElement, message) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = message;
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
    }

    function clearAllErrors() {
        const allInputs = registrationForm.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            input.classList.remove('error', 'success');
        });

        const allErrors = registrationForm.querySelectorAll('.error-message');
        allErrors.forEach(error => {
            error.textContent = '';
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#14b8a6'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            font-size: 14px;
            animation: slideInRight 0.4s ease-out;
            max-width: 400px;
        `;
        notification.textContent = message;

        // Add animation styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 4000);
    }

    // ===================================
    // LINK HANDLING (Demo Mode)
    // ===================================

    const links = document.querySelectorAll('a[href="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const linkText = this.textContent.trim();

            if (linkText === 'Terms & Conditions') {
                showNotification('Terms & Conditions page would open here', 'info');
            } else if (linkText === 'Privacy Policy') {
                showNotification('Privacy Policy page would open here', 'info');
            } else if (linkText === 'Sign in here') {
                showNotification('Redirecting to login page...', 'info');
                // In production: window.location.href = '/login';
            } else {
                showNotification(`Link to: ${linkText}`, 'info');
            }
        });
    });

    // ===================================
    // KEYBOARD SHORTCUTS
    // ===================================

    document.addEventListener('keydown', function (e) {
        // Navigate between fields with Enter key
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
            e.preventDefault();

            const inputs = Array.from(registrationForm.querySelectorAll('input, textarea'));
            const currentIndex = inputs.indexOf(e.target);

            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }
    });

    // ===================================
    // DATE INPUT RESTRICTIONS
    // ===================================

    // Set max date to 18 years ago
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDateString = maxDate.toISOString().split('T')[0];
    dobInput.setAttribute('max', maxDateString);

    // Set min date to 100 years ago
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const minDateString = minDate.toISOString().split('T')[0];
    dobInput.setAttribute('min', minDateString);

    // ===================================
    // AUTO-SAVE DRAFT (Optional Enhancement)
    // ===================================

    // Uncomment to enable auto-save functionality
    /*
    let autoSaveTimeout;

    function autoSaveDraft() {
        clearTimeout(autoSaveTimeout);
        
        autoSaveTimeout = setTimeout(() => {
            const draftData = {
                fullName: fullNameInput.value,
                fatherName: fatherNameInput.value,
                dob: dobInput.value,
                email: emailInput.value,
                address: addressInput.value,
                phone: phoneInput.value
            };
            
            // Note: localStorage is not available in Claude.ai artifacts
            // In production environment, you would use:
            // localStorage.setItem('registrationDraft', JSON.stringify(draftData));
            
            console.log('Draft saved:', draftData);
        }, 1000);
    }

    allInputs.forEach(input => {
        input.addEventListener('input', autoSaveDraft);
    });

    // Load draft on page load
    // In production environment:
    // const savedDraft = localStorage.getItem('registrationDraft');
    // if (savedDraft) {
    //     const draftData = JSON.parse(savedDraft);
    //     fullNameInput.value = draftData.fullName || '';
    //     fatherNameInput.value = draftData.fatherName || '';
    //     dobInput.value = draftData.dob || '';
    //     emailInput.value = draftData.email || '';
    //     addressInput.value = draftData.address || '';
    //     phoneInput.value = draftData.phone || '';
    // }
    */

    // ===================================
    // CONSOLE LOG ON PAGE LOAD
    // ===================================

    console.log('%c🚀 Troywings Technologies Registration System', 'color: #14b8a6; font-size: 16px; font-weight: bold;');
    console.log('%cVersion: 1.0.0 | A Drive for Future', 'color: #94a3b8; font-size: 12px;');
});

// ===================================
// PRODUCTION READY API INTEGRATION
// ===================================

/**
 * Example API call function for production use
 * Uncomment and modify for actual implementation
 */
/*
async function registerUser(formData) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            showNotification('Registration successful!', 'success');
            
            // Redirect to login or dashboard
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            // Show error message from server
            showNotification(data.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred. Please try again later.', 'error');
    }
}
*/