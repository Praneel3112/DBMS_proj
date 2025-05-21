// Wait for DOM to load
window.addEventListener('DOMContentLoaded', function () {
  const showAddBtn = document.getElementById('showAddOffenderFine');
  const showCheckBtn = document.getElementById('showCheckFine');
  const showUpdateBtn = document.getElementById('showUpdateOffender');
  const addOffenderFineForm = document.getElementById('addOffenderFineForm');
  const checkFineForm = document.getElementById('checkFineForm');
  const updateOffenderForm = document.getElementById('updateOffenderForm');
  const resultMsg = document.getElementById('resultMsg');

  // Hide all forms initially
  addOffenderFineForm.style.display = 'none';
  checkFineForm.style.display = 'none';
  updateOffenderForm.style.display = 'none';

  showAddBtn.onclick = function() {
    addOffenderFineForm.style.display = '';
    checkFineForm.style.display = 'none';
    updateOffenderForm.style.display = 'none';
    resultMsg.innerText = '';
  };
  showCheckBtn.onclick = function() {
    addOffenderFineForm.style.display = 'none';
    checkFineForm.style.display = '';
    updateOffenderForm.style.display = 'none';
    resultMsg.innerText = '';
  };
  showUpdateBtn.onclick = function() {
    addOffenderFineForm.style.display = 'none';
    checkFineForm.style.display = 'none';
    updateOffenderForm.style.display = '';
    resultMsg.innerText = '';
  };

  // Add Offender Form Submission
  addOffenderFineForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('offenderName').value.trim();
    const license = document.getElementById('offenderLicense').value.trim();
    const address = document.getElementById('offenderAddress').value.trim();
    const contact = document.getElementById('offenderContact').value.trim();
    const fineAmount = document.getElementById('fineAmountAdd').value.trim();
    const violationType = document.getElementById('violationTypeAdd').value;
    const regNum = document.getElementById('offenderRegNum').value.trim();
    resultMsg.style.color = '#d7263d';
    if (!name || !license || !address || !contact || !fineAmount || isNaN(fineAmount) || Number(fineAmount) <= 0 || !violationType) {
      resultMsg.innerText = 'All fields are required and fine amount must be valid.';
      return;
    }
    fetch('/api/add-offender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, license, address, contact, fineAmount: Number(fineAmount), violationType, regNum })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          resultMsg.style.color = 'green';
          let msg = 'Offender and fine added successfully!';
          if (data.regNum) {
            msg += `<br><b>Vehicle Registration Number:</b> ${data.regNum}<br>Use this number to check fines for this offender.`;
          }
          resultMsg.innerHTML = msg;
          addOffenderFineForm.reset();
        } else {
          resultMsg.innerText = data.message || 'Failed to add offender and fine.';
        }
      })
      .catch(() => {
        resultMsg.innerText = 'Error adding offender and fine.';
      });
  };

  // Check Fine Form Submission
  checkFineForm.onsubmit = function(e) {
    e.preventDefault();
    const reg = document.getElementById('regNumCheck').value.trim();
    const license = document.getElementById('checkLicense').value.trim();
    const phone = document.getElementById('checkPhone').value.trim();
    resultMsg.style.color = '#d7263d';
    if (!reg && !license && !phone) {
      resultMsg.innerText = 'Please enter at least one detail to check fine.';
      return;
    }
    resultMsg.innerText = 'Checking...';
    const params = [];
    if (reg) params.push(`reg=${encodeURIComponent(reg)}`);
    if (license) params.push(`license=${encodeURIComponent(license)}`);
    if (phone) params.push(`phone=${encodeURIComponent(phone)}`);
    fetch(`/api/fines?${params.join('&')}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const fine = data[0];
          const dueDate = fine.Due_Date ? fine.Due_Date.toString().split('T')[0] : '';
          resultMsg.style.color = 'green';
          resultMsg.innerHTML = `Status: <b>${fine.Payment_Status}</b><br>Fine Amount: <b>₹${fine.Amount}</b><br>Due Date: <b>${dueDate}</b><br>Late Fee: <b>₹${fine.Late_Fee}</b>`;
        } else if (data && data.message) {
          resultMsg.innerText = data.message;
        } else {
          resultMsg.innerText = 'No fines found for the given details.';
        }
      })
      .catch(() => {
        resultMsg.innerText = 'Error checking fine.';
      });
  };

  // Update Offender Form Submission
  updateOffenderForm.onsubmit = function(e) {
    e.preventDefault();
    const license = document.getElementById('updateLicense').value.trim();
    const contact = document.getElementById('updateContact').value.trim();
    const address = document.getElementById('updateAddress').value.trim();
    const name = document.getElementById('updateName').value.trim();
    resultMsg.style.color = '#d7263d';
    if (!license || (!contact && !address && !name)) {
      resultMsg.innerText = 'Enter license number and at least one field to update.';
      return;
    }
    fetch('/api/update-offender', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license, contact, address, name })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          resultMsg.style.color = 'green';
          resultMsg.innerText = 'Details updated successfully!';
          updateOffenderForm.reset();
        } else {
          resultMsg.innerText = data.message || 'Failed to update details.';
        }
      })
      .catch(() => {
        resultMsg.innerText = 'Error updating details.';
      });
  };
});
