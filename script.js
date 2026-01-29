document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.querySelector('.text-container');
    const revealBlob = document.querySelector('.reveal-blob');
    const hiddenText = document.querySelector('.hidden-text');
    const logoContainer = document.querySelector('.logo-container');
    const logoHidden = document.querySelector('.logo-hidden');
    
    let mouseX = 0;
    let mouseY = 0;
    let blobX = 0;
    let blobY = 0;
    let currentBlobSize = 20;
    let isInsideText = false;
    let isInsideLogo = false;
    let isInsideNav = false;

    function animateBlob() {
        const blobRect = revealBlob.getBoundingClientRect();
        currentBlobSize = blobRect.width;

        const minSpeed = 0.08;
        const maxSpeed = 0.25;
        const speed = maxSpeed - ((currentBlobSize - 20) / (400 - 20)) * (maxSpeed - minSpeed);
        
        blobX += (mouseX - blobX) * speed;
        blobY += (mouseY - blobY) * speed;

        const rect = textContainer.getBoundingClientRect();
        const relativeX = blobX - rect.left;
        const relativeY = blobY - rect.top;
        const clipRadius = currentBlobSize / 2;
        
        gsap.set(hiddenText, {
            clipPath: `circle(${clipRadius}px at ${relativeX}px ${relativeY}px)`
        });

        const logoRect = logoContainer.getBoundingClientRect();
        const logoRelativeX = blobX - logoRect.left;
        const logoRelativeY = blobY - logoRect.top;
        
        gsap.set(logoHidden, {
            clipPath: `circle(${clipRadius}px at ${logoRelativeX}px ${logoRelativeY}px)`
        });

        gsap.set(revealBlob, {
            left: blobX,
            top: blobY
        });

        requestAnimationFrame(animateBlob);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    textContainer.addEventListener('mouseenter', () => {
        isInsideText = true;
        gsap.to(revealBlob, {
            width: 400,
            height: 400,
            duration: 0.5,
            ease: 'power2.out'
        });
        hiddenText.style.zIndex = '11';
        revealBlob.style.zIndex = '10';
    });

    textContainer.addEventListener('mouseleave', () => {
        isInsideText = false;
        if (!isInsideLogo && !isInsideNav) {
            gsap.to(revealBlob, {
                width: 20,
                height: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
        hiddenText.style.zIndex = '10';
        revealBlob.style.zIndex = '11';
    });

    logoContainer.addEventListener('mouseenter', () => {
        isInsideLogo = true;
        gsap.to(revealBlob, {
            width: 80,
            height: 80,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    logoContainer.addEventListener('mouseleave', () => {
        isInsideLogo = false;
        if (!isInsideText && !isInsideNav) {
            gsap.to(revealBlob, {
                width: 20,
                height: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    const navLinks = document.querySelector('.nav-links');
    const navContainers = document.querySelectorAll('.nav-link-container');

    navLinks.addEventListener('mouseenter', () => {
        isInsideNav = true;
        gsap.to(revealBlob, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    navContainers.forEach((container, index) => {
        const overlay = container.querySelector('.nav-link-overlay');
        
        if (container.classList.contains('active')) return;
        
        container.addEventListener('mouseenter', () => {
            gsap.fromTo(overlay, 
                { clipPath: 'inset(0 0 100% 0)' },
                { clipPath: 'inset(0 0 0% 0)', duration: 0.3, ease: 'power2.out' }
            );
        });

        container.addEventListener('mouseleave', () => {
            if (index !== 0) {
                gsap.fromTo(overlay, 
                    { clipPath: 'inset(0 0 0% 0)' },
                    { clipPath: 'inset(0 0 100% 0)', duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    });

    navLinks.addEventListener('mouseleave', () => {
        isInsideNav = false;
        
        gsap.to(revealBlob, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });

        navContainers.forEach((container, index) => {
            if (index !== 0) {
                const overlay = container.querySelector('.nav-link-overlay');
                gsap.to(overlay, { 
                    clipPath: 'inset(0 0 100% 0)', 
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
            }
        });
    });

    animateBlob();
});