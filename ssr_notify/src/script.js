class CyberpunkNotification {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
        this.maxNotifications = 5;
    }

    show(options) {
        const { title, message, type, duration } = options;
        const normalizedType = this.normalizeType(type);
        const safeTitle = this.escapeHTML(title || 'PARKOUR');
        const safeMessage = this.escapeHTML(message || 'สำเร็จพร้อมใช้งานแล้ว');
        const key = this.createNotificationKey(safeTitle, safeMessage, normalizedType);

        const duplicate = this.notifications.find((item) => item.dataset.notifyKey === key);
        if (duplicate) {
            this.bumpDuplicateNotification(duplicate, duration);
            this.playNotificationSound();
            return duplicate;
        }

        this.playNotificationSound();

        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldest();
        }

        const notification = this.createNotification({
            safeTitle,
            safeMessage,
            normalizedType,
            duration,
            key
        });

        this.container.appendChild(notification);
        this.notifications.push(notification);
        this.startRemovalTimer(notification, duration);

        return notification;
    }

    createNotificationKey(title, message, type) {
        return `${type}|${title}|${message}`;
    }

    startRemovalTimer(notification, duration) {
        if (!notification) return;

        if (notification.__removeTimer) {
            clearTimeout(notification.__removeTimer);
        }

        notification.__removeTimer = setTimeout(() => {
            this.remove(notification);
        }, duration);
    }

    restartProgressRing(notification, duration) {
        const progressRing = notification.querySelector('.icon-progress-ring .value');
        if (!progressRing) return;

        progressRing.style.animation = 'none';
        // force reflow so the animation can be restarted
        progressRing.getBoundingClientRect();
        progressRing.style.animation = `ringCountdown ${duration}ms linear forwards`;
    }

    bumpDuplicateNotification(notification, duration) {
        const currentCount = Number(notification.dataset.repeatCount || 1);
        const nextCount = currentCount + 1;

        notification.dataset.repeatCount = String(nextCount);

        const repeatBadge = notification.querySelector('.notification-repeat');
        if (repeatBadge) {
            repeatBadge.textContent = `x${nextCount}`;
            repeatBadge.classList.remove('pop');
            repeatBadge.getBoundingClientRect();
            repeatBadge.classList.add('pop');
        }

        notification.classList.remove('pulse');
        notification.getBoundingClientRect();
        notification.classList.add('pulse');

        this.restartProgressRing(notification, duration);
        this.startRemovalTimer(notification, duration);
    }

    playNotificationSound() {
        try {
            const audio = new Audio('sound.wav');
            audio.volume = 0.5;
            audio.play().catch((e) => console.log('Sound play failed:', e));
        } catch (e) {
            console.log('Sound loading failed:', e);
        }
    }

    createNotification({ safeTitle, safeMessage, normalizedType, duration, key }) {
        const notification = document.createElement('div');
        notification.className = `notification ${normalizedType}`;
        notification.dataset.notifyKey = key;
        notification.dataset.repeatCount = '1';

        const icon = this.getTypeIcon(normalizedType);
        const text = this.buildDisplayText(safeTitle, safeMessage);

        notification.innerHTML = `
            <div class="notification-card">
                <span class="notification-accent"></span>
                <span class="notification-text">${text}</span>
                <span class="notification-repeat">x1</span>
            </div>
            <div class="notification-icon-wrap">
                <svg class="icon-progress-ring" viewBox="0 0 42 42" aria-hidden="true">
                    <circle class="track" cx="21" cy="21" r="18"></circle>
                    <circle class="value" cx="21" cy="21" r="18"></circle>
                </svg>
                <i class="fa-solid ${icon} notification-icon"></i>
            </div>
        `;

        this.restartProgressRing(notification, duration);

        return notification;
    }

    buildDisplayText(title, message) {
        if (!message) {
            return title;
        }

        return `${title} : ${message}`;
    }

    normalizeType(type) {
        const normalized = String(type || '').toLowerCase();
        const allowed = ['success', 'error', 'warning', 'info'];
        return allowed.includes(normalized) ? normalized : 'info';
    }

    getTypeIcon(type) {
        const icons = {
            success: 'fa-check',
            error: 'fa-xmark',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };

        return icons[type] || 'fa-info';
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    remove(notification) {
        if (!notification || !notification.parentNode) return;

        if (notification.__removeTimer) {
            clearTimeout(notification.__removeTimer);
            notification.__removeTimer = null;
        }

        notification.classList.add('hiding');

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 250);
    }

    removeOldest() {
        if (this.notifications.length > 0) {
            this.remove(this.notifications[0]);
        }
    }

    success(title, message, duration = 5000) {
        return this.show({ title, message, type: 'success', duration });
    }

    error(title, message, duration = 5000) {
        return this.show({ title, message, type: 'error', duration });
    }

    info(title, message, duration = 5000) {
        return this.show({ title, message, type: 'info', duration });
    }

    warning(title, message, duration = 5000) {
        return this.show({ title, message, type: 'warning', duration });
    }
}

const notifications = new CyberpunkNotification();

function showNotification(title, message, type = 'info', duration = 5000) {
    return notifications.show({ title, message, type, duration });
}

window.addEventListener('message', function(event) {
    if (event.data?.type !== 'alert') {
        return;
    }

    const info = event.data.info || {};
    notifications.show({
        title: info.title || 'PARKOUR',
        message: info.msg || 'สำเร็จพร้อมใช้งานแล้ว',
        type: info.type || 'info',
        duration: 5000
    });
});
