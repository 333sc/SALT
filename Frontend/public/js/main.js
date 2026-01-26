    // Mobile menu toggle
        
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');



        //esta shit abre el hamburger menu and if menu is "active" when u click over its button, the function will close that shit.
        hamburger.addEventListener('click', () => {
            if(navMenu.classList.contains("active")){ // contains read all classes from our css 
                document.body.style.overflow = "auto";
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');           
            }else{
                document.body.style.overflow = "hidden";
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            document.body.style.overflow = "auto";
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));

        

        // Carrusel functionality
        const carouselInner = document.querySelector('.carousel-inner');
        const indicators = document.querySelectorAll('.carousel-indicator');
        let currentIndex = 0;

        function showSlide(index) {
            if (index < 0) index = indicators.length - 1;
            if (index >= indicators.length) index = 0;
            
            carouselInner.style.transform = `translateX(-${index * 100}%)`;
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Auto-advance carousel
        setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000);

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });



// Lucide Icons replace, Juancho pls help me
document.addEventListener("DOMContentLoaded", function() {
    lucide.createIcons();
});