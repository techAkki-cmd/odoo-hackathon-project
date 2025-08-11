// src/utils/animations.js - Professional Animation Controller
export class AnimationController {
    constructor() {
        this.animations = new Map();
        this.registerDefaultAnimations();
    }

    registerDefaultAnimations() {
        // Fade animations
        this.register('fadeIn', [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 500, easing: 'ease-out' });

        this.register('fadeOut', [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-20px)' }
        ], { duration: 500, easing: 'ease-in' });

        // Slide animations
        this.register('slideInRight', [
            { transform: 'translateX(100%)' },
            { transform: 'translateX(0)' }
        ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

        this.register('slideInLeft', [
            { transform: 'translateX(-100%)' },
            { transform: 'translateX(0)' }
        ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

        this.register('slideInUp', [
            { transform: 'translateY(100%)' },
            { transform: 'translateY(0)' }
        ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

        // Bounce animation
        this.register('bounce', [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
        ], { duration: 600, easing: 'ease-in-out' });

        // Scale animations
        this.register('scaleIn', [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ], { duration: 400, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });

        this.register('scaleOut', [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
        ], { duration: 300, easing: 'ease-in' });
    }

    register(name, keyframes, options = {}) {
        this.animations.set(name, { keyframes, options });
    }

    play(element, animationName, customOptions = {}) {
        const animation = this.animations.get(animationName);
        if (!animation) {
            console.warn(`Animation "${animationName}" not found`);
            return null;
        }

        const options = { ...animation.options, ...customOptions };
        return element.animate(animation.keyframes, options);
    }

    async fadeIn(element, duration = 500) {
        const animation = this.play(element, 'fadeIn', { duration });
        return new Promise(resolve => {
            if (animation) {
                animation.addEventListener('finish', resolve);
            } else {
                setTimeout(resolve, duration);
            }
        });
    }

    async fadeOut(element, duration = 500) {
        const animation = this.play(element, 'fadeOut', { duration });
        return new Promise(resolve => {
            if (animation) {
                animation.addEventListener('finish', resolve);
            } else {
                setTimeout(resolve, duration);
            }
        });
    }

    async slideIn(element, direction = 'right', duration = 600) {
        const animationName = `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
        const animation = this.play(element, animationName, { duration });
        return new Promise(resolve => {
            if (animation) {
                animation.addEventListener('finish', resolve);
            } else {
                setTimeout(resolve, duration);
            }
        });
    }

    async bounce(element, duration = 600) {
        const animation = this.play(element, 'bounce', { duration });
        return new Promise(resolve => {
            if (animation) {
                animation.addEventListener('finish', resolve);
            } else {
                setTimeout(resolve, duration);
            }
        });
    }

    async exitAnimation(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.95)';
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async enterAnimation(element, animationType = 'fadeIn', duration = 600) {
        element.style.opacity = '0';

        const animations = {
            fadeIn: () => {
                element.style.transform = 'translateY(20px) scale(0.95)';
            },
            slideInRight: () => {
                element.style.transform = 'translateX(100px)';
            },
            slideInLeft: () => {
                element.style.transform = 'translateX(-100px)';
            },
            slideInUp: () => {
                element.style.transform = 'translateY(100px)';
            },
            bounceIn: () => {
                element.style.transform = 'scale(0.3)';
            }
        };

        animations[animationType]?.();

        requestAnimationFrame(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0) scale(1)';
        });

        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // Utility methods
    shake(element, intensity = 'normal') {
        const intensityMap = {
            light: 4,
            normal: 8,
            strong: 12
        };

        const distance = intensityMap[intensity] || intensityMap.normal;

        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${distance}px)` },
            { transform: `translateX(${distance}px)` },
            { transform: `translateX(-${distance}px)` },
            { transform: `translateX(${distance}px)` },
            { transform: 'translateX(0)' }
        ];

        return element.animate(keyframes, {
            duration: 500,
            easing: 'ease-in-out'
        });
    }

    pulse(element, scale = 1.05, duration = 600) {
        const keyframes = [
            { transform: 'scale(1)' },
            { transform: `scale(${scale})` },
            { transform: 'scale(1)' }
        ];

        return element.animate(keyframes, {
            duration,
            easing: 'ease-in-out'
        });
    }
}
