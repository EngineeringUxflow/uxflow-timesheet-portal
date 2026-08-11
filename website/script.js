// SAP Fiori JavaScript Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('UXFLOW SAP Solutions - Fiori Implementation Loaded');
    
    // Smooth scrolling for navigation
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.fd-shellbar').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Make scrollToSection globally available
    window.scrollToSection = scrollToSection;
    
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Shell bar scroll effect
    const shellbar = document.querySelector('.fd-shellbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            shellbar.style.background = 'rgba(53, 74, 95, 0.95)';
            shellbar.style.backdropFilter = 'blur(10px)';
        } else {
            shellbar.style.background = 'var(--sapShellColor)';
            shellbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Tile click handlers
    document.querySelectorAll('.fd-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            const title = this.querySelector('.fd-tile__title').textContent;
            
            // Handle specific tile actions
            switch(title) {
                case 'Timesheet Portal':
                    window.open('http://31.97.175.224:3000', '_blank');
                    break;
                case 'Cloud Platform':
                    scrollToSection('solutions');
                    break;
                case 'Integration Suite':
                    scrollToSection('solutions');
                    break;
                case 'HANA Cloud':
                    scrollToSection('solutions');
                    break;
                default:
                    console.log(`Clicked on ${title}`);
            }
        });
        
        // Add hover effects
        tile.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--sapContent_Shadow3)';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--sapContent_Shadow1)';
        });
    });
    
    // Card hover effects
    document.querySelectorAll('.fd-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--sapContent_Shadow3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--sapContent_Shadow1)';
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.fd-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show SAP Fiori style notification
            showFioriNotification('Request sent successfully! Our SAP team will contact you soon.', 'success');
            
            // Reset form
            this.reset();
            
            // Log for demo purposes
            console.log('Form submitted:', formObject);
        });
    }
    
    // SAP Fiori style notification system
    function showFioriNotification(message, type = 'information') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.fd-message-strip');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `fd-message-strip fd-message-strip--${type}`;
        
        // Set colors based on type
        let backgroundColor, textColor, iconClass;
        switch(type) {
            case 'success':
                backgroundColor = 'var(--sapPositiveColor)';
                textColor = 'white';
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                backgroundColor = 'var(--sapNegativeColor)';
                textColor = 'white';
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                backgroundColor = 'var(--sapCriticalColor)';
                textColor = 'white';
                iconClass = 'fas fa-exclamation-triangle';
                break;
            default:
                backgroundColor = 'var(--sapInformationColor)';
                textColor = 'white';
                iconClass = 'fas fa-info-circle';
        }
        
        notification.innerHTML = `
            <div class="fd-message-strip__content">
                <i class="${iconClass} fd-message-strip__icon"></i>
                <span class="fd-message-strip__text">${message}</span>
                <button class="fd-message-strip__close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: calc(2.75rem + 1rem);
            right: 1rem;
            background: ${backgroundColor};
            color: ${textColor};
            padding: 1rem 1.5rem;
            border-radius: var(--sapElement_BorderCornerRadius);
            box-shadow: var(--sapContent_Shadow2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-family: var(--sapFontFamily);
            font-size: var(--sapFontSize);
        `;
        
        // Add styles for content
        const style = document.createElement('style');
        style.textContent = `
            .fd-message-strip__content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .fd-message-strip__icon {
                font-size: 1rem;
                flex-shrink: 0;
            }
            .fd-message-strip__text {
                flex: 1;
                line-height: 1.4;
            }
            .fd-message-strip__close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: var(--sapElement_BorderCornerRadius);
                transition: background 0.2s ease;
                flex-shrink: 0;
            }
            .fd-message-strip__close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        
        if (!document.querySelector('#fiori-notification-styles')) {
            style.id = 'fiori-notification-styles';
            document.head.appendChild(style);
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.fd-message-strip__close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fd-tile, .fd-card, .fd-section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.fd-shellbar__nav-item[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('fd-shellbar__nav-item--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('fd-shellbar__nav-item--active');
            }
        });
    });
    
    // Add active state styles
    const activeNavStyle = document.createElement('style');
    activeNavStyle.textContent = `
        .fd-shellbar__nav-item--active {
            background: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
        }
    `;
    document.head.appendChild(activeNavStyle);
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close notifications
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.fd-message-strip');
            notifications.forEach(notification => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            });
        }
    });
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll events for better performance
    const debouncedScrollHandler = debounce(() => {
        // Additional scroll handling if needed
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--sapShellColor);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: white;
            font-family: var(--sapFontFamily);
        ">
            <div style="text-align: center;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p style="margin: 0; font-size: var(--sapFontSize);">Loading UXFLOW SAP Solutions...</p>
            </div>
        </div>
    `;
    
    // Add spin animation
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    document.body.appendChild(loadingOverlay);
    
    // Hide loading screen when everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1000);
    });
    
    // Console branding
    console.log('%c🚀 UXFLOW SAP Solutions', 'color: #0070f3; font-size: 16px; font-weight: bold;');
    console.log('%cSAP Fiori Design System Implementation', 'color: #6a6d70; font-size: 12px;');
    console.log('%cPowered by SAP Business Technology Platform', 'color: #6a6d70; font-size: 12px;');
});