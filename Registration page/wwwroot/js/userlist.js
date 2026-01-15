/**
 * Troywings User Management
 * Premium interactions & AJAX handling
 */

const UserListManager = {

    // Store original values to restore on cancel
    originalValues: {},

    /**
     * Enable Edit Mode for a Row
     */
    enableEdit: function (id) {
        const row = document.getElementById(`row_${id}`);
        if (!row) return;

        // 1. Snapshot current values (for cancel functionality)
        this.originalValues[id] = {
            name: row.querySelector('.name').innerText,
            email: row.querySelector('.email').innerText,
            phone: row.querySelector('.phone').innerText,
            father: row.querySelector('.father').innerText,
            address: row.querySelector('.address').innerText
        };

        // 2. Toggle UI to Inputs
        this.toggleRowState(row, true);
    },

    /**
     * Cancel Edit Mode
     */
    cancelEdit: function (id) {
        const row = document.getElementById(`row_${id}`);
        if (!row || !this.originalValues[id]) return;

        // Restore values
        const data = this.originalValues[id];
        row.querySelector('.name-input').value = data.name;
        row.querySelector('.email-input').value = data.email;
        row.querySelector('.phone-input').value = data.phone;
        row.querySelector('.father-input').value = data.father;
        row.querySelector('.address-input').value = data.address;

        // Switch back to View mode
        this.toggleRowState(row, false);
    },

    /**
     * Save Data via AJAX
     */
    saveUser: function (id) {
        const row = document.getElementById(`row_${id}`);
        if (!row) return;

        const btnSave = row.querySelector('.btn-save');
        const originalBtnContent = btnSave.innerHTML;

        // Loading State
        btnSave.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
        btnSave.disabled = true;

        // Collect Data
        const updatedData = {
            Id: id,
            FullName: row.querySelector('.name-input').value,
            Email: row.querySelector('.email-input').value,
            Phone: row.querySelector('.phone-input').value,
            FatherName: row.querySelector('.father-input').value,
            Address: row.querySelector('.address-input').value,
            DateOfBirth: new Date().toISOString()
        };

        // Send Request
        fetch('/Home/UpdateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update Text Views
                    row.querySelector('.name').innerText = updatedData.FullName;
                    row.querySelector('.email').innerText = updatedData.Email;
                    row.querySelector('.phone').innerText = updatedData.Phone;
                    row.querySelector('.father').innerText = updatedData.FatherName;
                    row.querySelector('.address').innerText = updatedData.Address;

                    this.toggleRowState(row, false);
                    this.showToast(data.message, 'success');
                } else {
                    this.showToast("Error: " + data.message, 'error');
                }
            })
            .catch(error => {
                console.error(error);
                this.showToast("Connection failed.", 'error');
            })
            .finally(() => {
                btnSave.innerHTML = originalBtnContent;
                btnSave.disabled = false;
            });
    },

    /**
     * Helper: Toggle between View (false) and Edit (true) states
     */
    toggleRowState: function (row, isEditMode) {
        // Toggle Inputs vs Text
        const views = row.querySelectorAll('.view-mode');
        const inputs = row.querySelectorAll('.editable-input');

        views.forEach(el => el.classList.toggle('d-none', isEditMode));
        inputs.forEach(el => el.classList.toggle('d-none', !isEditMode));

        // Toggle Buttons
        const btnEdit = row.querySelector('.btn-edit');
        const btnSave = row.querySelector('.btn-save');
        const btnCancel = row.querySelector('.btn-cancel');

        if (isEditMode) {
            btnEdit.classList.add('d-none');
            btnSave.style.display = 'inline-flex';
            btnCancel.classList.remove('d-none');
            btnCancel.style.display = 'inline-flex';
            row.classList.add('editing-active'); // For styling highlights
        } else {
            btnEdit.classList.remove('d-none');
            btnSave.style.display = 'none';
            btnCancel.classList.add('d-none');
            btnCancel.style.display = 'none';
            row.classList.remove('editing-active');
        }
    },

    /**
     * Show Professional Toast Notification
     */
    showToast: function (message, type) {
        const container = document.getElementById('toast-container');
        const toastEl = document.createElement('div');

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const color = type === 'success' ? '#14b8a6' : '#ef4444';

        toastEl.className = 'toast show toast-custom fade-in-up';
        toastEl.style.borderLeftColor = color;

        toastEl.innerHTML = `
            <div class="toast-body">
                <i class="fas ${icon} fa-lg" style="color: ${color}"></i>
                <span class="fw-medium">${message}</span>
            </div>
        `;

        container.appendChild(toastEl);

        // Auto remove
        setTimeout(() => {
            toastEl.style.opacity = '0';
            setTimeout(() => toastEl.remove(), 300);
        }, 4000);
    }
};