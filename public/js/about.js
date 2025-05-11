document.addEventListener('DOMContentLoaded', () => {
    const circles1 = document.querySelectorAll('.circle-1');
    const expandedBox1 = document.querySelector('.expanded-container-1');
    let activeCircle1 = null;

    circles1.forEach(circle => {
        circle.addEventListener('click', () => {
            if (activeCircle1) activeCircle1.style.display = ''; // Display the circle of the currently expanded box

            // Change the active circle and hide it
            activeCircle1 = circle;
            activeCircle1.style.display = 'none';

            // Populate the expanded box
            const heading = circle.querySelector('.heading').textContent;
            const contentHTML = circle.querySelector('.content').innerHTML;
            expandedBox1.innerHTML = `
                <h2>${heading}</h2>
                <div class="content">${contentHTML}</div>
            `;
            expandedBox1.classList.add('expanded');
        });
    });

    expandedBox1.addEventListener('click', () => {
        // Display the circle of the currently expanded box; no active circle
        if (activeCircle1) activeCircle1.style.display = '';
        activeCircle1 = null;

        // Empty out the expanded box
        expandedBox1.innerHTML = '';
        expandedBox1.classList.remove('expanded');
    });

    const circles2 = document.querySelectorAll('.circle-2');
    const expandedBox2 = document.querySelector('.expanded-container-2');
    let activeCircle2 = null;

    circles2.forEach(circle => {
        circle.addEventListener('click', () => {
            if (activeCircle2) activeCircle2.style.display = ''; // Display the circle of the currently expanded box

            // Change the active circle and hide it
            activeCircle2 = circle;
            activeCircle2.style.display = 'none';

            // Populate the expanded box
            const heading = circle.querySelector('.heading').textContent;
            let contentHTML, wrapperClass;
            if (heading === 'Our Team') {
                contentHTML = circle.querySelector('.content-grid').innerHTML;
                wrapperClass = 'content-grid';
            }
            else {
                contentHTML = circle.querySelector('.content').innerHTML;
                wrapperClass = 'content';
            }
            expandedBox2.innerHTML = `
                <h2>${heading}</h2>
                <div class="${wrapperClass}">${contentHTML}</div>
            `;
            expandedBox2.classList.add('expanded');
        });
    });

    expandedBox2.addEventListener('click', () => {
        // Display the circle of the currently expanded box; no active circle
        if (activeCircle2) activeCircle2.style.display = '';
        activeCircle2 = null;

        // Empty out the expanded box
        expandedBox2.innerHTML = '';
        expandedBox2.classList.remove('expanded');
    });
});
