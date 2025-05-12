document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option');
    const sections = document.querySelectorAll('.main-content > div');

    const sectionMap = {
        'orders': 0,
        'change-password': 1,
        'addresses': 2,
        'payments': 3
    };

    let defaultSection = sectionMap[selectedSection] || 0;

    options[defaultSection].classList.add('active');
    sections[defaultSection].classList.add('active');

    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            sections[index].classList.add('active');
        });
    });
});