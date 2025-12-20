document.addEventListener('DOMContentLoaded', () => {

    // Scroll Reveal Animation (Simple version without IntersectionObserver for robustness, or use simple one)
    const fadeElems = document.querySelectorAll('.feature-item');

    const checkFade = () => {
        fadeElems.forEach(elem => {
            const rect = elem.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                elem.style.opacity = '1';
                elem.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for js-enabled fade
    fadeElems.forEach(elem => {
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(20px)';
        elem.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    window.addEventListener('scroll', checkFade);
    checkFade(); // Check on load

    // Fun: Mouse parallax effect for Floating Cheeses
    const cheeses = document.querySelectorAll('.floating-cheese');

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        cheeses.forEach((cheese, index) => {
            const speed = (index + 1) * 20; // different speeds
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;

            // Allow existing CSS animation (translateY) to work by composing
            // This is tricky with plain JS overriding transform.
            // A safer way is modifying CSS Custom Properties if set up, 
            // but here let's just gently nudge them using margin/left/top or strictly transform if we remove keyframes.
            // For now, let's just leave the keyframes as they are more robust for "fun" ambient motion.

            // Alternative: Move the background or something subtle?
            // Let's rotate the logo on hover instead for interaction.
        });
    });

    // Logo Spin on Hover (Fun touch)
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.transform = 'rotate(360deg)';
            logo.style.transition = 'transform 0.5s ease';
        });
        logo.addEventListener('mouseout', () => {
            logo.style.transform = 'rotate(0deg)';
        });
    }

    // --- Infinite Carousel Implementation ---
    const track = document.querySelector('.carousel-track');
    // Only run if track exists
    if (track) {
        let slides = Array.from(track.children);
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Clone first and last slides for infinite effect
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        // Append/Prepend clones
        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        // Re-query slides to include clones
        const allSlides = document.querySelectorAll('.carousel-slide');

        let counter = 1; // Start at 1 (the real first slide)
        let intervalTime = 10000; // 10 seconds
        let autoSlideInterval;

        // Initial position
        track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;

        function activeSlidePosition(index) {
            // Calculate position based on slide width. 
            // Slides might resize, so we should recalculate width or assume fixed.
            // For robustness, getting width dynamically.
            return index * allSlides[0].offsetWidth;
        }

        const nextSlide = () => {
            if (counter >= allSlides.length - 1) return;
            track.style.transition = "transform 0.5s ease-in-out";
            counter++;
            track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;
        };

        const prevSlide = () => {
            if (counter <= 0) return;
            track.style.transition = "transform 0.5s ease-in-out";
            counter--;
            track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;
        };

        // Transition End Listener for Infinite Jump
        track.addEventListener('transitionend', () => {
            if (allSlides[counter].isEqualNode(firstClone)) {
                track.style.transition = "none";
                counter = 1; // Jump to real first
                track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;
            }
            if (allSlides[counter].isEqualNode(lastClone)) {
                track.style.transition = "none";
                counter = slides.length; // Jump to real last
                track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;
            }
        });

        // Auto Play
        const startAutoSlide = () => {
            clearInterval(autoSlideInterval); // Clear existing to prevent duplicates
            autoSlideInterval = setInterval(nextSlide, intervalTime);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        startAutoSlide();

        // Swipe Interaction
        let touchStartX = 0;
        let touchEndX = 0;

        const handleGesture = () => {
            if (touchEndX < touchStartX - 50) {
                // Swipe Left -> Next
                nextSlide();
                stopAutoSlide(); // Pause on interaction
                startAutoSlide(); // Restart timer
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe Right -> Prev
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        };

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
            startAutoSlide();
        });

        // Handle Resize to keep alignment
        window.addEventListener('resize', () => {
            track.style.transition = "none"; // Disable animation during resize
            track.style.transform = `translateX(${-activeSlidePosition(counter)}px)`;
        });

        // Button Controls
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
    }
});
