document.addEventListener('DOMContentLoaded', () => {
    const circles1 = document.querySelectorAll('.circle-1');
    const expandedBox1 = document.querySelector('.expanded-container-1');
    let activeCircle1 = null;

    circles1.forEach(circle => {
        circle.addEventListener('click', () => {
            if (activeCircle1) activeCircle1.style.display = '';

            // Change the active circle and hide it
            activeCircle1 = circle;
            activeCircle1.style.display = 'none';

            // Populate the expanded box
            const heading = circle.querySelector('.heading').textContent;
            const contentHTML = circle.querySelector('.content').innerHTML;
            expandedBox1.innerHTML = `
                <div class="expanded-heading">
                    <h2>${heading}</h2>
                    <img src="/images/about/collapse.png" alt="Collapse topic" class="collapse"> 
                </div>
                <div class="content">${contentHTML}</div>
            `;
            expandedBox1.classList.add('expanded');

            const collapseImg = expandedBox1.querySelector('.collapse');
            collapseImg.addEventListener('click', () => {
                if (activeCircle1) activeCircle1.style.display = '';
                activeCircle1 = null;

                // Empty out the expanded box
                expandedBox1.innerHTML = '';
                expandedBox1.classList.remove('expanded');
            }, { once: true });
        });
    });

    const circles2 = document.querySelectorAll('.circle-2');
    const expandedBox2 = document.querySelector('.expanded-container-2');
    let activeCircle2 = null;

    circles2.forEach(circle => {
        circle.addEventListener('click', () => {
            if (activeCircle2) activeCircle2.style.display = '';

            // Change the active circle and hide it
            activeCircle2 = circle;
            activeCircle2.style.display = 'none';

            // Populate the expanded box
            const heading = circle.querySelector('.heading').textContent;
            const contentHTML = heading === 'Our Team'
                ? circle.querySelector('.content-grid').innerHTML
                : circle.querySelector('.content').innerHTML;
            const wrapperClass = heading === 'Our Team' ? 'content-grid' : 'content';
            expandedBox2.innerHTML = `
                <div class="expanded-heading">
                    <h2>${heading}</h2>
                    <img src="/images/about/collapse.png" alt="Collapse topic" class="collapse"> 
                </div>
                <div class="${wrapperClass}">${contentHTML}</div>
            `;
            expandedBox2.classList.add('expanded');

            const collapseImg = expandedBox2.querySelector('.collapse');
            collapseImg.addEventListener('click', () => {
                if (activeCircle2) activeCircle2.style.display = '';
                activeCircle2 = null;

                // Empty out the expanded box
                expandedBox2.innerHTML = '';
                expandedBox2.classList.remove('expanded');
            }, { once: true });
        });
    });
});