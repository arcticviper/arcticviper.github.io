const mainImage = document.getElementById('main-image');
const emoteImage = document.getElementById('emote');
const starsBurst = document.getElementById('stars-burst');
const image1 = 'images/image1.jpg';
const image2 = 'images/image2.jpg';
const counterText = document.getElementById('counter-text');

let isMouseDown = false;
let clickCount = 0;
let holdActive = false;
let holdInterval = null;

const gamblingImages = [
    'gambling/images/cherry.png',
    'gambling/images/diamond.png',
    'gambling/images/grape.png',
    'gambling/images/lemon.png',
    'gambling/images/orange.png',
    'gambling/images/star.png',
    'gambling/images/watermelon.png'
];

function getRandomGamblingImage() {
    return gamblingImages[Math.floor(Math.random() * gamblingImages.length)];
}

// Hold button functionality
const holdBtn = document.getElementById('hold-btn');

function startHold() {
    holdActive = true;
    holdBtn.classList.add('active');
    mainImage.src = image2;
    emoteImage.src = 'images/emote2.gif';
    incrementCounter();
    
    holdInterval = setInterval(() => {
        incrementCounter();
    }, 200);
}

function stopHold() {
    holdActive = false;
    holdBtn.classList.remove('active');
    clearInterval(holdInterval);
    holdInterval = null;
    mainImage.src = image1;
    if (clickCount % 10 === 0) {
        emoteImage.src = getRandomGamblingImage();
    } else {
        emoteImage.src = 'images/emote.png';
    }
}

holdBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (holdActive) {
        stopHold();
    } else {
        startHold();
    }
});
holdBtn.addEventListener('mousedown', function(e) {
    e.stopPropagation();
});
holdBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
    e.preventDefault();
});
holdBtn.addEventListener('touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (holdActive) {
        stopHold();
    } else {
        startHold();
    }
});

// Function to increment and update counter
function incrementCounter() {
    clickCount++;
    
    if (clickCount === 1) {
        document.getElementById('click-counter').classList.remove('pulse');
    }
    
    // Trigger stars burst animation on multiples of 10
    if (clickCount % 10 === 0) {
        starsBurst.classList.add('active');
        setTimeout(() => {
            starsBurst.classList.remove('active');
        }, 1000);
    }
}

// Mouse events for desktop
document.addEventListener('mousedown', function(e) {
    if (e.target.closest('#gambling-btn') || e.target.closest('#fullscreen-btn') || e.target.closest('#hold-btn') || e.target.closest('#telegram-btn') || e.target.closest('#telegram-overlay') || e.target.closest('#counter-text')) return;
    if (e.button === 0) { // Left click only
        isMouseDown = true;
        mainImage.src = image2;
        // Use emote2.gif if next click will be a multiple of 10, otherwise use regular emote.gif
        emoteImage.src = (clickCount + 1) % 10 === 0 ? 'images/emote.gif' : 'images/emote.gif';
        incrementCounter();
    }
});

document.addEventListener('mouseup', function(e) {
    if (holdActive) return;
    if (e.button === 0) { // Left click only
        isMouseDown = false;
        mainImage.src = image1;
        // Set correct emote based on click count
        if (clickCount % 10 === 0) {
            emoteImage.src = getRandomGamblingImage();
        } else {
            emoteImage.src = 'images/emote.png';
        }
    }
});

// Touch events for mobile
document.addEventListener('touchstart', function(e) {
    // Skip if touching interactive buttons
    if (e.target.closest('#gambling-btn') || e.target.closest('#fullscreen-btn') || e.target.closest('#hold-btn') || e.target.closest('#telegram-btn') || e.target.closest('#telegram-overlay') || e.target.closest('#counter-text')) return;
    e.preventDefault();
    mainImage.src = image2;
    // Use emote2.gif if next click will be a multiple of 10, otherwise use regular emote.gif
    emoteImage.src = (clickCount + 1) % 10 === 0 ? 'images/emote.gif' : 'images/emote.gif';
    incrementCounter();
});

document.addEventListener('touchend', function(e) {
    // Skip if touching interactive buttons
    if (e.target.closest('#gambling-btn') || e.target.closest('#fullscreen-btn') || e.target.closest('#hold-btn') || e.target.closest('#telegram-btn') || e.target.closest('#telegram-overlay') || e.target.closest('#counter-text')) return;
    if (holdActive) return;
    e.preventDefault();
    mainImage.src = image1;
    // Set correct emote based on click count
    if (clickCount % 10 === 0) {
        emoteImage.src = getRandomGamblingImage();
    } else {
        emoteImage.src = 'images/emote.png';
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Fullscreen functionality with mobile support
const fullscreenBtn = document.getElementById('fullscreen-btn');
const enterIcon = document.getElementById('enter-icon');
const exitIcon = document.getElementById('exit-icon');

// Helper function to check if currently in fullscreen
function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

// Helper function to enter fullscreen with vendor prefixes
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    } else if (element.webkitEnterFullscreen) {
        // For iOS video elements
        return element.webkitEnterFullscreen();
    } else if (element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen not supported'));
}

// Helper function to exit fullscreen with vendor prefixes
function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        return document.msExitFullscreen();
    }
    return Promise.reject(new Error('Exit fullscreen not supported'));
}

// Update button icon based on fullscreen state
function updateFullscreenIcon() {
    const clickCounter = document.getElementById('click-counter');
    
    if (isFullscreen()) {
        enterIcon.style.display = 'none';
        exitIcon.style.display = 'block';
        fullscreenBtn.style.display = 'none';
        clickCounter.classList.add('fullscreen-expanded');
        telegramBtn.style.display = 'none';
        gamblingBtn.style.display = 'none';
        holdBtn.style.display = 'none';
    } else {
        enterIcon.style.display = 'block';
        exitIcon.style.display = 'none';
        fullscreenBtn.style.display = 'flex';
        clickCounter.classList.remove('fullscreen-expanded');
        telegramBtn.style.display = 'flex';
        gamblingBtn.style.display = 'flex';
        holdBtn.style.display = 'flex';
    }
}

// Toggle fullscreen
function toggleFullscreen(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isFullscreen()) {
        // Enter fullscreen
        enterFullscreen(document.documentElement)
            .then(() => {
                updateFullscreenIcon();
            })
            .catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
    } else {
        // Exit fullscreen
        exitFullscreen()
            .then(() => {
                updateFullscreenIcon();
            })
            .catch(err => {
                console.log('Error attempting to exit fullscreen:', err);
            });
    }
}

// Click event for desktop
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Touch event for mobile (prevents conflicts with image switching)
fullscreenBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
});

fullscreenBtn.addEventListener('touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleFullscreen(e);
});

// Gambling button - prevent touch conflicts with image switching
const gamblingBtn = document.getElementById('gambling-btn');
gamblingBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = 'gambling/slot-machine.html';
});
gamblingBtn.addEventListener('mousedown', function(e) {
    e.stopPropagation();
});
gamblingBtn.addEventListener('mouseup', function(e) {
    e.stopPropagation();
});
gamblingBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
    e.preventDefault();
});
gamblingBtn.addEventListener('touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = 'gambling/slot-machine.html';
});

// Listen for all fullscreen change events (vendor prefixes)
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

// Telegram overlay functionality
const telegramBtn = document.getElementById('telegram-btn');
const telegramOverlay = document.getElementById('telegram-overlay');
const telegramClose = document.getElementById('telegram-close');

function openTelegramOverlay() {
    telegramOverlay.classList.add('active');
}

function closeTelegramOverlay() {
    telegramOverlay.classList.remove('active');
}

telegramBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    openTelegramOverlay();
});
telegramBtn.addEventListener('mousedown', function(e) {
    e.stopPropagation();
});
telegramBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
    e.preventDefault();
});
telegramBtn.addEventListener('touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();
    openTelegramOverlay();
});

telegramClose.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTelegramOverlay();
});
telegramClose.addEventListener('touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();
    closeTelegramOverlay();
});

// Close overlay when clicking outside the content
telegramOverlay.addEventListener('click', function(e) {
    if (e.target === telegramOverlay) {
        closeTelegramOverlay();
    }
});
telegramOverlay.addEventListener('touchend', function(e) {
    if (e.target === telegramOverlay) {
        e.preventDefault();
        closeTelegramOverlay();
    }
});
