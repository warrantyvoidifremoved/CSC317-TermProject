const menuToggle = document.getElementById('mobile-menu-toggle');
const mobileNavLinks = document.querySelector('.mobile-nav');

menuToggle.addEventListener('click', () => {
	mobileNavLinks.classList.toggle('open');
});