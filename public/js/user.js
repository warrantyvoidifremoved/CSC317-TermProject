document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option');
    const sections = document.querySelectorAll('.main-content > div');
    const initialSection = document.querySelector('.main-content').dataset.selectedSection || 'orders';

    function clearActiveState() {
        options.forEach(btn => btn.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
    }

    function activateSection(sectionName) {
        clearActiveState();

        const button = document.querySelector(`.option[data-section="${sectionName}"]`);
        const section = document.querySelector(`.main-content > div[data-section="${sectionName}"]`);

        if (button) button.classList.add('active');
        if (section) section.classList.add('active');
    }

    activateSection(initialSection);
    
    options.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            activateSection(targetSection);
        });
    });
});