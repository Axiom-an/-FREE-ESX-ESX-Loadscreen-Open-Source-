document.addEventListener('DOMContentLoaded', () => {
    
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); 
    }

    let discordUrl = '';

    if (typeof Config !== 'undefined') {
        if (Config.serverName) {
            const titleEl = document.getElementById('serverTitle');
            if (titleEl) titleEl.innerText = Config.serverName;
        }
        if (Config.serverSubtitle) {
            const welcomeEl = document.getElementById('welcomeMessage');
            if (welcomeEl) welcomeEl.innerText = Config.serverSubtitle;
        }
        if (Config.social && Config.social.discord) {
            discordUrl = Config.social.discord;
        }
    }

    const discordBtn = document.getElementById('discordButton');
    if (discordBtn) {
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (discordUrl && discordUrl !== '') {
                if (window.invokeNative) {
                    window.invokeNative('openUrl', discordUrl);
                } else {
                    window.open(discordUrl, '_blank');
                }
            }
        });
    }

    const audio = document.getElementById('bgAudio');
    const muteBtn = document.getElementById('muteBtn');
    const volUpBtn = document.getElementById('volUpBtn');
    const volDownBtn = document.getElementById('volDownBtn');

    if (audio && typeof Config !== 'undefined' && Config.audio) {
        const audioFile = Config.audio.fileName || 'music.mp3';
        audio.src = 'mp3/' + audioFile;
        audio.volume = Config.audio.defaultVolume !== undefined ? Config.audio.defaultVolume : 0.5;

        const updateMuteButtonUI = () => {
            if (!muteBtn) return;
            if (audio.muted) {
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Unmute</span>';
            } else {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Mute</span>';
            }
        };

        const toggleMute = () => {
            audio.muted = !audio.muted;
            updateMuteButtonUI();
        };

        window.focus();

        audio.play().then(() => {
            updateMuteButtonUI();
        }).catch((err) => {
            console.log("Autoplay waiting for interaction:", err);
        });

        document.addEventListener('click', () => {
            window.focus();
            if (audio.paused) {
                audio.play();
                updateMuteButtonUI();
            }
        });

        if (muteBtn) muteBtn.addEventListener('click', toggleMute);

        if (volUpBtn) {
            volUpBtn.addEventListener('click', () => {
                if (audio.volume < 1.0) {
                    audio.volume = Math.min(1.0, audio.volume + 0.1);
                    audio.muted = false;
                    updateMuteButtonUI();
                }
            });
        }

        if (volDownBtn) {
            volDownBtn.addEventListener('click', () => {
                if (audio.volume > 0.0) {
                    audio.volume = Math.max(0.0, audio.volume - 0.1);
                    updateMuteButtonUI();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.keyCode === 32 || e.key === ' ') {
                e.preventDefault(); 
                if (audio.paused) {
                    audio.play();
                } else {
                    toggleMute();
                }
            }
        });
    }

    const updateProgress = (fraction) => {
        const progress = Math.min(100, Math.max(0, Math.round(fraction * 100)));
        const welcomeMsg = document.getElementById('welcomeMessage');

        if (welcomeMsg) {
            welcomeMsg.style.setProperty('--progress', progress + '%');

            if (progress >= 85) {
                welcomeMsg.classList.add('completed');
            }
        }
    };

    window.addEventListener('message', (e) => {
        if (e.data.eventName === 'loadProgress') {
            updateProgress(e.data.loadFraction);
        } else if (e.data.eventName === 'onLogLine') {
            if (e.data.fraction !== undefined) {
                updateProgress(e.data.fraction);
            }
        }
    });

});