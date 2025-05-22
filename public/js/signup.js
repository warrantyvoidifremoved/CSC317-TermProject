document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('signup-form');
	const usernameInput = document.getElementById('username');
	const usernameError = document.getElementById('username-error');
	const passwordInput = document.getElementById('password');
	const passwordError = document.getElementById('password-error');

	function validateUsername() {
		const isValidLength = usernameInput.value.length >= 4 && usernameInput.value.length <= 20;
		const hasUppercase = /[A-Z]/.test(usernameInput.value);
		const hasNumber = /\d/.test(usernameInput.value);
		const isValid = isValidLength && hasUppercase && hasNumber;
		if (!isValid) {
			usernameError.textContent = 'Username must be 4–20 characters, include an uppercase letter and a number.';
		}
		else {
			usernameError.textContent = ''
		}
		return isValid
	}

	function validatePassword() {
		const isValidLength = passwordInput.value.length >= 4 && passwordInput.value.length <= 20;
		const hasUppercase = /[A-Z]/.test(passwordInput.value);
		const hasNumber = /\d/.test(passwordInput.value)
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value);
		const isValid = isValidLength && hasUppercase && hasNumber && hasSpecialChar;
		if (!isValid) {
			passwordError.textContent = 'Password must be 8-25 characters, include an uppercase letter, have a special character, and a number.';
		}
		else {
			passwordError.textContent = ''
		}
		return isValid
	}
	usernameInput.addEventListener('input', validateUsername);
	passwordInput.addEventListener('input', validatePassword);

});