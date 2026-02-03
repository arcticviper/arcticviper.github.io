const mainImage = document.getElementById('main-image');
const emoteImage = document.getElementById('emote');
const image1 = 'images/image1.jpg';
const image2 = 'images/image2.jpg';
const counterValue = document.getElementById('counter-value');
const counterLabel = document.getElementById('counter-label');

let isMouseDown = false;
let clickCount = 0;

// Function to increment and update counter
function incrementCounter() {
    clickCount++;
    
    if (clickCount === 1) {
        // After first click, change text and show counter, remove pulse animation
        counterLabel.innerHTML = '<span style="font-size: 20px; display: block; text-align: center;">Tap to Pet</span>Times Petted: ';
        counterValue.style.display = 'inline';
        document.getElementById('click-counter').classList.remove('pulse');
    }
    
    counterValue.textContent = clickCount;
}

// Mouse events for desktop
document.addEventListener('mousedown', function(e) {
    if (e.button === 0) { // Left click only
        isMouseDown = true;
        mainImage.src = image2;
        emoteImage.src = 'images/emote.gif';
        incrementCounter();
    }
});

document.addEventListener('mouseup', function(e) {
    if (e.button === 0) { // Left click only
        isMouseDown = false;
        mainImage.src = image1;
        emoteImage.src = 'images/emote.png';
    }
});

// Touch events for mobile
document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    mainImage.src = image2;
    emoteImage.src = 'images/emote.gif';
    incrementCounter();
});

document.addEventListener('touchend', function(e) {
    e.preventDefault();
    mainImage.src = image1;
    emoteImage.src = 'images/emote.png';
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
    if (isFullscreen()) {
        enterIcon.style.display = 'none';
        exitIcon.style.display = 'block';
        fullscreenBtn.style.display = 'none'; // Hide button in fullscreen
    } else {
        enterIcon.style.display = 'block';
        exitIcon.style.display = 'none';
        fullscreenBtn.style.display = 'flex'; // Show button when not in fullscreen
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

// Listen for all fullscreen change events (vendor prefixes)
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
