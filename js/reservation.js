// Blue Waves Cafe - Reservation Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservation-form');

    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.value = formattedDate;
            dateInput.min = formattedDate;
        }

        // Form validation and submission
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });

            // Remove existing messages
            const existingMessages = document.querySelectorAll('.success-message, .error-message');
            existingMessages.forEach(msg => msg.remove());

            // Get form values
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const guests = document.getElementById('guests');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const message = document.getElementById('message');

            let isValid = true;

            // Validate name
            if (!name.value.trim()) {
                name.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                email.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate phone
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
                phone.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate guests
            if (!guests.value) {
                guests.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate date
            if (!date.value) {
                date.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    date.closest('.form-group').classList.add('error');
                    showError('Please select a date in the future.');
                    isValid = false;
                }
            }

            // Validate time
            if (!time.value) {
                time.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // If validation fails, stop here
            if (!isValid) {
                showError('Please fill in all required fields correctly.');
                return;
            }

            // Disable submit button
            const submitButton = reservationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Booking Your Table... 🌊';

            // Prepare form data
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                guests: guests.value,
                date: date.value,
                time: time.value,
                message: message.value.trim(),
                restaurant: 'Blue Waves Cafe'
            };

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Success
                showSuccess('🌊 Reservation submitted successfully! We\'ll contact you soon to confirm your table by the shore.');
                
                // Reset form
                reservationForm.reset();
                
                // Reset date to today
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                dateInput.value = formattedDate;

                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Optional: Send confirmation email via backend
                console.log('Reservation Details:', formData);
                
            }, 1500);

            // For actual implementation with Formspree or backend:
            /*
            fetch(reservationForm.action, {
                method: 'POST',
                body: new FormData(reservationForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showSuccess('🌊 Reservation submitted successfully! We\'ll contact you soon.');
                    reservationForm.reset();
                    dateInput.value = formattedDate;
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(error => {
                showError('Oops! Something went wrong. Please try again or call us directly.');
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
            */
        });

        // Real-time validation feedback
        const inputs = reservationForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.closest('.form-group').classList.remove('error');
                }
            });

            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.closest('.form-group').classList.remove('error');
                }
            });
        });

        // Time slot suggestions based on selected date
        const timeInput = document.getElementById('time');
        if (timeInput && dateInput) {
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                
                // Add helpful time suggestions
                const dayOfWeek = selectedDate.getDay();
                let suggestedTime = '';
                
                if (dayOfWeek === 0) { // Sunday
                    suggestedTime = '12:00'; // Lunch time
                } else if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
                    suggestedTime = '19:00'; // Dinner time
                } else {
                    suggestedTime = '18:00'; // Weekday dinner
                }
                
                if (!timeInput.value) {
                    timeInput.value = suggestedTime;
                }
            });
        }
    }

    // Helper functions
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        reservationForm.insertBefore(successDiv, reservationForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        reservationForm.insertBefore(errorDiv, reservationForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Add party size recommendations
    const guestsSelect = document.getElementById('guests');
    if (guestsSelect) {
        guestsSelect.addEventListener('change', function() {
            const guestsCount = parseInt(this.value);
            const messageField = document.getElementById('message');
            
            if (guestsCount >= 7 && messageField && !messageField.value) {
                messageField.placeholder = 'For parties of 7+, please let us know if you have any special seating preferences. We recommend booking at least 24 hours in advance.';
            }
        });
    }

    // Add calendar icon to date input (visual enhancement)
    const dateInputElement = document.getElementById('date');
    if (dateInputElement) {
        dateInputElement.addEventListener('focus', function() {
            this.style.borderColor = 'var(--ocean-blue)';
        });
        
        dateInputElement.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
        });
    }
});

// Add styles for success and error messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    .success-message {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        color: #155724;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        border-left: 4px solid var(--tropical-teal);
        animation: slideIn 0.3s ease;
    }
    
    .error-message {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        color: #721c24;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        border-left: 4px solid #dc3545;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #dc3545;
        animation: shake 0.3s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(messageStyles);