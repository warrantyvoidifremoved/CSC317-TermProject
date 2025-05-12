document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(faqItem => {
        faqItem.addEventListener('click', () => {
            faqItem.classList.toggle('expanded');
        });
    });

    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(categoryButton => {
        categoryButton.addEventListener('click', () => {
            categoryButtons.forEach(button => button.classList.remove('active'));
            categoryButton.classList.add('active');

            const buttonCategory = categoryButton.getAttribute('data-category');
    
            faqItems.forEach(faqItem => {
                const itemCategory = faqItem.getAttribute('data-category');

                if (buttonCategory === 'all' || itemCategory === buttonCategory) {
                    faqItem.style.display = 'block';
                }
                else {
                    faqItem.style.display = 'none';
                }

                faqItem.classList.remove('expanded');
            });
        });
    });    
});