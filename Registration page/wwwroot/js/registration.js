/**
 * Troywings Technologies - Registration Page
 * Form Validation, Animations & User Interactions (Bootstrap Compatible)
 */

document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // DOM ELEMENTS
    // ===================================

    const form = document.getElementById('registrationForm');
    const inputs = {
        fullName: document.getElementById('fullName'),
        fatherName: document.getElementById('fatherName'),
        dob: document.getElementById('dob'),
        email: document.getElementById('email'),
        address: document.getElementById('address'),
        phone: document.getElementById('phone'),
        terms: document.getElementById('terms')
    };

    const errors = {
        fullName: document.getElementById('fullNameError'),
        fatherName: document.getElementById('fatherNameError'),
        dob: document.getElementById('dobError'),
        email: document.getElementById('emailError'),
        address: document.getElementById('addressError'),
        phone: document.getElementById('phoneError')
    };

    // ===================================
    // FORM SUBMISSION
    // ===================================

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear all previous errors
        clearAllErrors();

        // Validate all fields
        let isValid = true;

        if (!validateFullName()) isValid = false;
        if (!validateFatherName()) isValid = false;
        if (!validateDOB()) isValid = false;
        if (!validateEmail()) isValid = false;
        if (!validateAddress()) isValid = false;

        // Phone is optional but validate if provided
        if (inputs.phone.value.trim() && !validatePhone()) {
            isValid = false;
        }

        // Check terms
        if (!inputs.terms.checked) {
            showNotification('Please accept the Terms & Conditions', 'error');
            isValid = false;
        }

        // Submit if valid
        if (isValid) {
            submitForm();
        } else {
            showNotification('Please fix the errors in the form', 'error');
        }
    });

    // ===================================
    // VALIDATION FUNCTIONS
    // ===================================

    function validateFullName() {
        const value = inputs.fullName.value.trim();

        if (!value) {
            setError('fullName', 'Full name is required');
            return false;
        }

        if (value.length < 3) {
            setError('fullName', 'Name must be at least 3 characters long');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(value)) {
            setError('fullName', 'Name should only contain letters and spaces');
            return false;
        }

        setSuccess('fullName');
        return true;
    }

    function validateFatherName() {
        const value = inputs.fatherName.value.trim();

        if (!value) {
            setError('fatherName', "Father's name is required");
            return false;
        }

        if (value.length < 3) {
            setError('fatherName', 'Name must be at least 3 characters long');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(value)) {
            setError('fatherName', 'Name should only contain letters and spaces');
            return false;
        }

        setSuccess('fatherName');
        return true;
    }

    function validateDOB() {
        const value = inputs.dob.value;

        if (!value) {
            setError('dob', 'Date of birth is required');
            return false;
        }

        const birthDate = new Date(value);
        const today = new Date();
        const age = calculateAge(birthDate, today);

        if (age < 18) {
            setError('dob', 'You must be at least 18 years old');
            return false;
        }

        if (age > 100) {
            setError('dob', 'Please enter a valid date of birth');
            return false;
        }

        setSuccess('dob');
        return true;
    }

    function validateEmail() {
        const value = inputs.email.value.trim();

        if (!value) {
            setError('email', 'Email address is required');
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            setError('email', 'Please enter a valid email address');
            return false;
        }

        setSuccess('email');
        return true;
    }

    function validateAddress() {
        const value = inputs.address.value.trim();

        if (!value) {
            setError('address', 'Address is required');
            return false;
        }

        if (value.length < 10) {
            setError('address', 'Please enter a complete address (minimum 10 characters)');
            return false;
        }

        setSuccess('address');
        return true;
    }

    function validatePhone() {
        const value = inputs.phone.value.trim();

        if (value) {
            const digitsOnly = value.replace(/\D/g, '');

            if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                setError('phone', 'Please enter a valid phone number (10-15 digits)');
                return false;
            }
        }

        setSuccess('phone');
        return true;
    }

    // ===================================
    // REAL-TIME VALIDATION
    // ===================================

    inputs.fullName.addEventListener('blur', validateFullName);
    inputs.fatherName.addEventListener('blur', validateFatherName);
    inputs.dob.addEventListener('blur', validateDOB);
    inputs.email.addEventListener('blur', validateEmail);
    inputs.address.addEventListener('blur', validateAddress);
    inputs.phone.addEventListener('blur', validatePhone);

    // Clear error on input
    Object.keys(inputs).forEach(key => {
        if (inputs[key] && inputs[key].type !== 'checkbox') {
            inputs[key].addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    if (errors[key]) {
                        errors[key].textContent = '';
                    }
                }
            });
        }
    });

    // ===================================
    // INPUT ANIMATIONS
    // ===================================

    const allTextInputs = document.querySelectorAll('.form-control');

    allTextInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // ===================================
    // PHONE NUMBER FORMATTING
    // ===================================

    inputs.phone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value.length <= 10) {
                // Format: XXXXX XXXXX
                value = value.replace(/(\d{5})(\d{1,5})/, '$1 $2');
            } else {
                // Format: +XX XXXXX XXXXX
                value = value.replace(/(\d{2})(\d{5})(\d{1,5})/, '+$1 $2 $3');
            }
        }

        e.target.value = value.trim();
    });

    // ===================================
    // DATE RESTRICTIONS
    // ===================================

    const today = new Date();

    // Maximum date: 18 years ago
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    inputs.dob.max = formatDate(maxDate);

    // Minimum date: 100 years ago
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    inputs.dob.min = formatDate(minDate);

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.classList.contains('form-control') && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();

            const formElements = Array.from(form.querySelectorAll('.form-control')).filter(el => {
                return el.type !== 'checkbox' && el.type !== 'submit';
            });

            const currentIndex = formElements.indexOf(e.target);

            if (currentIndex > -1 && currentIndex < formElements.length - 1) {
                formElements[currentIndex + 1].focus();
            }
        }
    });

    // ===================================
    // LINK HANDLING
    // ===================================

    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const text = this.textContent.trim();

            if (text === 'Terms & Conditions') {
                showNotification('Terms & Conditions page - Coming soon', 'info');
            } else if (text === 'Privacy Policy') {
                showNotification('Privacy Policy page - Coming soon', 'info');
            } else if (text === 'Sign in here') {
                showNotification('Redirecting to login page...', 'info');
                // In production: window.location.href = '/login';
            }
        });
    });

    // ===================================
    // FORM SUBMISSION HANDLER
    // ===================================

    function submitForm() {
        const submitBtn = form.querySelector('.btn-submit');

        // Show loading state
        submitBtn.classList.add('loading');

        // 1. Prepare the data
        const formData = {
            fullName: inputs.fullName.value.trim(),
            fatherName: inputs.fatherName.value.trim(),
            dateOfBirth: inputs.dob.value,
            email: inputs.email.value.trim(),
            address: inputs.address.value.trim(),
            phone: inputs.phone.value.trim() || null
        };

        // 2. Send to Backend
        fetch('/Home/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                // Remove loading state
                submitBtn.classList.remove('loading');

                if (data.success) {
                    // Success!
                    showNotification(data.message, 'success');
                    setTimeout(() => {
                        form.reset();
                        clearAllErrors();
                    }, 2000);
                } else {
                    // Error from server (e.g., DB failed)
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.classList.remove('loading');
                showNotification('Server error. Please try again.', 'error');
            });
    }

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    function setError(fieldName, message) {
        inputs[fieldName].classList.add('error');
        inputs[fieldName].classList.remove('success');
        if (errors[fieldName]) {
            errors[fieldName].textContent = message;
        }
    }

    function setSuccess(fieldName) {
        inputs[fieldName].classList.remove('error');
        inputs[fieldName].classList.add('success');
        if (errors[fieldName]) {
            errors[fieldName].textContent = '';
        }
    }

    function clearAllErrors() {
        Object.keys(inputs).forEach(key => {
            if (inputs[key] && inputs[key].type !== 'checkbox') {
                inputs[key].classList.remove('error', 'success');
            }
        });

        Object.keys(errors).forEach(key => {
            if (errors[key]) {
                errors[key].textContent = '';
            }
        });
    }

    function calculateAge(birthDate, today) {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';

        // Set color based on type
        let bgColor;
        switch (type) {
            case 'success':
                bgColor = '#10b981';
                break;
            case 'error':
                bgColor = '#ef4444';
                break;
            case 'warning':
                bgColor = '#f59e0b';
                break;
            default:
                bgColor = '#14b8a6';
        }

        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 18px 28px;
            background: ${bgColor};
            color: white;
            border-radius: 14px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            font-weight: 600;
            font-size: 15px;
            max-width: 420px;
            animation: slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        `;

        notification.textContent = message;

        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(450px);
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
                        transform: translateX(450px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 4000);
    }

    // ===================================
    // CONSOLE INFO
    // ===================================

    console.log('%c🚀 Troywings Technologies', 'color: #14b8a6; font-size: 18px; font-weight: bold;');
    console.log('%cRegistration System v1.0 (Bootstrap) - A Drive for Future', 'color: #94a3b8; font-size: 13px;');
    console.log('%cForm validation and animations active', 'color: #10b981; font-size: 12px;');
});

// ===================================
// PRODUCTION API INTEGRATION
// ===================================

/**
 * Use this function for actual API integration
 * Uncomment and modify for production
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
            showNotification('Registration successful!', 'success');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
            
        } else {
            showNotification(data.message || 'Registration failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred. Please try again later.', 'error');
    }
}
*/