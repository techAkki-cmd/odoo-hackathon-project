// src/utils/notifications.js - Professional Notification System
export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-4 pointer-events-none';
        document.body.appendChild(this.container);
    }

    setupStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                pointer-events: auto;
                transform: translateX(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                backdrop-filter: blur(12px);
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .notification-success {
                background: rgba(34, 197, 94, 0.95);
                color: white;
                border-left: 4px solid #10b981;
            }

            .notification-error {
                background: rgba(239, 68, 68, 0.95);
                color: white;
                border-left: 4px solid #dc2626;
            }

            .notification-warning {
                background: rgba(245, 158, 11, 0.95);
                color: white;
                border-left: 4px solid #d97706;
            }

            .notification-info {
                background: rgba(59, 130, 246, 0.95);
                color: white;
                border-left: 4px solid #2563eb;
            }

            .notification-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
            }

            .notification-content {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
            }

            .notification-close {
                background: none;
                border: none;
                color: currentColor;
                cursor: pointer;
                font-size: 18px;
                opacity: 0.7;
                transition: opacity 0.2s;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);

        // Limit notifications
        if (this.notifications.length >= this.maxNotifications) {
            this.remove(this.notifications[0]);
        }

        this.notifications.push(notification);
        this.container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-content">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        return notification;
    }

    remove(notification) {
        if (!notification || !notification.parentElement) return;

        notification.classList.add('hide');

        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}
