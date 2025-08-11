// Handle email verification on frontend
export function initializeEmailVerification() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('No verification token found');
        return;
    }

    // Show loading
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <p>Verifying your email...</p>
            </div>
        </div>
    `;

    // Call your backend API
    fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('✅ Email verified successfully! You can now log in.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                showError('❌ Verification failed: ' + data.message);
            }
        })
        .catch(error => {
            showError('❌ Verification failed: ' + error.message);
        });
}

function showSuccess(message) {
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center max-w-md mx-4">
                <div class="text-6xl mb-4">🎉</div>
                <h2 class="text-2xl font-bold text-green-600 mb-4">Success!</h2>
                <p class="text-gray-600">${message}</p>
            </div>
        </div>
    `;
}

function showError(message) {
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center max-w-md mx-4">
                <div class="text-6xl mb-4">❌</div>
                <h2 class="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
                <p class="text-gray-600 mb-4">${message}</p>
                <button onclick="window.location.href='/login'" class="bg-blue-600 text-white px-4 py-2 rounded">
                    Go to Login
                </button>
            </div>
        </div>
    `;
}
