/**
 * User List Management Logic
 * Handles row editing and AJAX updates.
 */

const UserListManager = {
    /**
     * Toggles a row from View Mode to Edit Mode
     * @param {number} id - The User ID
     */
    enableEdit: function (id) {
        const row = document.getElementById(`row_${id}`);
        if (!row) return;

        // 1. Toggle UI Elements
        row.querySelectorAll('.view-mode').forEach(el => el.classList.add('d-none'));
        row.querySelectorAll('.editable-input').forEach(el => el.classList.remove('d-none'));

        // 2. Toggle Buttons
        const btnEdit = row.querySelector('.btn-edit');
        const btnSave = row.querySelector('.btn-save');

        if (btnEdit) btnEdit.style.display = 'none';
        if (btnSave) btnSave.style.display = 'inline-flex';
    },

    /**
     * Collects data and sends AJAX request to update user
     * @param {number} id - The User ID
     */
    saveUser: function (id) {
        const row = document.getElementById(`row_${id}`);
        if (!row) return;

        // 1. Collect Data
        const updatedData = {
            Id: id,
            FullName: row.querySelector('.name-input').value,
            Email: row.querySelector('.email-input').value,
            Phone: row.querySelector('.phone-input').value,
            FatherName: row.querySelector('.father-input').value,
            Address: row.querySelector('.address-input').value,
            DateOfBirth: new Date().toISOString() // Preserving date format
        };

        // 2. Send AJAX Request
        const btnSave = row.querySelector('.btn-save');
        const originalText = btnSave.innerHTML;
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        btnSave.disabled = true;

        fetch('/Home/UpdateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.updateRowUI(row, updatedData);
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification("Error: " + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.showNotification("Server communication failed.", 'error');
            })
            .finally(() => {
                // Restore button state
                btnSave.innerHTML = originalText;
                btnSave.disabled = false;
            });
    },

    /**
     * Updates the View Mode text and reverts the UI
     */
    updateRowUI: function (row, data) {
        // Update Text
        row.querySelector('.view-mode.name').innerText = data.FullName;
        row.querySelector('.view-mode.email').innerText = data.Email;
        row.querySelector('.view-mode.phone').innerText = data.Phone;
        row.querySelector('.view-mode.father').innerText = data.FatherName;
        row.querySelector('.view-mode.address').innerText = data.Address;

        // Revert to View Mode
        row.querySelectorAll('.view-mode').forEach(el => el.classList.remove('d-none'));
        row.querySelectorAll('.editable-input').forEach(el => el.classList.add('d-none'));

        row.querySelector('.btn-edit').style.display = 'inline-flex';
        row.querySelector('.btn-save').style.display = 'none';
    },

    /**
     * Simple alert wrapper (can be replaced with a toast notification later)
     */
    showNotification: function (message, type) {
        // For now, using standard alert. 
        // In a real app, integrate with the toast system we used in registration.js
        alert(message);
    }
};