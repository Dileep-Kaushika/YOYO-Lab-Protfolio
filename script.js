// Smooth scrolling for navigation
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Modal functionality
function openModal(modalId) {
  // stop music if opening another modal
  if (modalId !== 'music-modal') {
    stopMusic(false);
  }

  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";

  // Reset to first tab when opening modal
  const firstTab = modal.querySelector(".tab-btn");
  const modalType = modalId.replace("-modal", "");
  if (firstTab) {
    const firstTabName = firstTab.textContent.toLowerCase().replace("/", "-").replace(" ", "-");
    // if your other switchTab override needs 3rd arg, pass firstTab as third
    switchTab(modalType, firstTabName);
  }
}

// Pause and reset audio + UI
function stopMusic(reset = true) {
  const audio = document.getElementById('audio-player');
  if (audio) {
    try {
      audio.pause();
      if (reset) audio.currentTime = 0;
    } catch (e) {}
  }

  // reset play button
  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    const icon = playBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-play';
    playBtn.classList.remove('playing');
  }

  // pause waveform
  const waveform = document.querySelector('#music-modal .waveform');
  if (waveform) {
    waveform.classList.add('paused');
    waveform.classList.remove('playing');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "auto";

  // stop music if the music modal was closed
  if (modalId === 'music-modal') {
    stopMusic(true);
  }
}

// Tab switching functionality
function switchTab(modalType, tabName) {
  // Remove active class from all tabs in this modal
  const modal = document.getElementById(modalType + "-modal")
  const tabs = modal.querySelectorAll(".tab-btn")
  const contents = modal.querySelectorAll(".tab-content")

  tabs.forEach((tab) => tab.classList.remove("active"))
  contents.forEach((content) => content.classList.remove("active"))

  // Add active class to clicked tab
  const activeTab = Array.from(tabs).find(
    (tab) => tab.textContent.toLowerCase().replace("/", "-").replace(" ", "-") === tabName,
  )
  if (activeTab) {
    activeTab.classList.add("active")
  }

  // Show corresponding content
  const activeContent = document.getElementById(modalType + "-" + tabName)
  if (activeContent) {
    activeContent.classList.add("active")
  }
}

// Portfolio filters + music preview control
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  function pauseAllPortfolioAudio() {
    document.querySelectorAll('.track-audio').forEach(a => {
      try { a.pause(); } catch {}
    });
    document.querySelectorAll('.track-play i').forEach(i => i.className = 'fa-solid fa-play');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // pause any playing previews
      pauseAllPortfolioAudio();

      // show/hide items
      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.98)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.98)';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Play/pause preview (one at a time)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.track-play');
    if (!btn) return;

    const card = btn.closest('.music-card');
    const audio = card.querySelector('.track-audio');
    const icon = btn.querySelector('i');

    // Stop others first
    document.querySelectorAll('.track-audio').forEach(a => {
      if (a !== audio) { try { a.pause(); } catch {} }
    });
    document.querySelectorAll('.track-play i').forEach(i => {
      if (i !== icon) i.className = 'fa-solid fa-play';
    });

    if (audio.paused) {
      audio.play().catch(()=>{});
      icon.className = 'fa-solid fa-pause';
    } else {
      audio.pause();
      icon.className = 'fa-solid fa-play';
    }

    // Reset icon when a track ends
    audio.addEventListener('ended', () => { icon.className = 'fa-solid fa-play'; }, { once: true });
  });
});

// Close modals when clicking outside (and stop music if it's the music modal)
window.addEventListener("click", (event) => {
  if (!event.target.classList.contains("modal")) return;

  const modal = event.target;
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  if (modal.id === 'music-modal') {
    stopMusic(true);
  }
});

  // Music player functionality
  const playBtn = document.querySelector(".play-btn")
  const playlistItems = document.querySelectorAll(".playlist-item")

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-play")) {
        icon.classList.remove("fa-play")
        icon.classList.add("fa-pause")
      } else {
        icon.classList.remove("fa-pause")
        icon.classList.add("fa-play")
      }
    })
  }

  // Playlist item selection
  playlistItems.forEach((item) => {
    item.addEventListener("click", function () {
      playlistItems.forEach((i) => i.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Contact form submission
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      alert("Thank you for your message! We will get back to you soon.")
      this.reset()
    })
  }

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(10, 10, 10, 0.98)"
    } else {
      navbar.style.background = "rgba(10, 10, 10, 0.95)"
    }
  })

  // Navigation link smooth scrolling
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      scrollToSection(targetId)
    })
  })


// Animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".service-card, .portfolio-item")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }
  })
}

// Initialize animations
document.addEventListener("DOMContentLoaded", () => {
  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll(".service-card, .portfolio-item")
  animatedElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(30px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  })

  // Trigger animation on scroll
  window.addEventListener("scroll", animateOnScroll)
  animateOnScroll() // Initial check
})

// About Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const aboutElements = document.querySelectorAll('.value-item, .team-member, .stat-item, .mission-statement');
    aboutElements.forEach(el => observer.observe(el));

    // Counter animation for statistics
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const increment = target / 50;
        let current = 0;
        const suffix = element.textContent.replace(/[0-9]/g, '');

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 40);
    }

    // Studio tour video functionality
    const playButton = document.querySelector('.image-overlay');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Create video modal
            createVideoModal();
        });
    }

    function createVideoModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="close-video-btn">&times;</button>
                <div class="video-container">
                    <video controls autoplay>
                        <source src="path-to-your-studio-tour-video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-video-btn');
        closeBtn.addEventListener('click', closeVideoModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideoModal();
            }
        });

        function closeVideoModal() {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    }

    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for about section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const aboutSection = document.querySelector('.about');
        
        if (aboutSection) {
            const rate = scrolled * -0.5;
            const aboutBg = aboutSection.querySelector('::before');
            if (aboutBg) {
                aboutSection.style.transform = `translateY(${rate}px)`;
            }
        }
    });

    // Value items sequential animation
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Team members sequential animation
    const teamMemberCards = document.querySelectorAll('.team-member');
    teamMemberCards.forEach((member, index) => {
        member.style.animationDelay = `${index * 0.2}s`;
    });

    // Smooth reveal animation for mission statement
    const missionStatement = document.querySelector('.mission-statement');
    if (missionStatement) {
        const missionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        missionObserver.observe(missionStatement);
        missionStatement.style.opacity = '0';
        missionStatement.style.transform = 'translateY(50px)';
        missionStatement.style.transition = 'all 0.8s ease';
    }
});

// Additional CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .video-modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .close-video-btn {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 1;
    }
    
    .video-container {
        border-radius: 10px;
        overflow: hidden;
    }
    
    .video-container video {
        width: 100%;
        height: auto;
        max-height: 80vh;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Enhanced Service Modal Animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Tab switching functionality with animations
    window.switchTab = function(service, tabName) {
        const tabBtns = document.querySelectorAll(`#${service}-modal .tab-btn`);
        const tabContents = document.querySelectorAll(`#${service}-modal .tab-content`);
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Add active class to clicked tab
        event.target.classList.add('active');
        
        // Show corresponding content with animation
        const targetContent = document.getElementById(`${service}-${tabName}`);
        if (targetContent) {
            setTimeout(() => {
                targetContent.style.display = 'block';
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 10);
            }, 200);
        }
        
        // Add click ripple effect
        createTabRipple(event.target);
    };
    
    // Create ripple effect for tabs
    function createTabRipple(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Video Modal Animations
    function initVideoModal() {
        const videoModal = document.getElementById('video-modal');
        if (!videoModal) return;
        
        // Animate project cards on modal open
        const projectCards = videoModal.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.03) rotateY(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
            });
        });
    }
    
    // Graphic Design Modal Animations
    function initDesignModal() {
        const designModal = document.getElementById('design-modal');
        if (!designModal) return;
        
        // Create color palette if it doesn't exist
        if (!designModal.querySelector('.color-palette')) {
            const colorPalette = document.createElement('div');
            colorPalette.className = 'color-palette';
            
            for (let i = 0; i < 5; i++) {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.addEventListener('click', function() {
                    // Create color burst effect
                    createColorBurst(this);
                });
                colorPalette.appendChild(swatch);
            }
            
            const firstTabContent = designModal.querySelector('.tab-content');
            if (firstTabContent) {
                firstTabContent.insertBefore(colorPalette, firstTabContent.firstChild);
            }
        }
    }
    
    function createColorBurst(element) {
        const colors = ['#8a2be2', '#4b0082', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (360 / 8) * i;
            const distance = 60;
            
            particle.style.position = 'absolute';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            element.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Voice Recording Modal Animations
    function initVoiceModal() {
        const voiceModal = document.getElementById('voice-modal');
        if (!voiceModal) return;
        
        // Create voice visualizer if it doesn't exist
        if (!voiceModal.querySelector('.voice-visualizer')) {
            const visualizer = document.createElement('div');
            visualizer.className = 'voice-visualizer stopped';
            
            for (let i = 0; i < 10; i++) {
                const bar = document.createElement('div');
                bar.className = 'voice-bar';
                visualizer.appendChild(bar);
            }
            
            const controls = document.createElement('div');
            controls.className = 'recording-controls';
            
            const recordBtn = document.createElement('button');
            recordBtn.className = 'record-btn';
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            recordBtn.addEventListener('click', toggleRecording);
            
            controls.appendChild(recordBtn);
            
            const firstTabContent = voiceModal.querySelector('.tab-content');
            if (firstTabContent) {
                firstTabContent.appendChild(visualizer);
                firstTabContent.appendChild(controls);
            }
        }
    }
    
    let isRecording = false;
    function toggleRecording() {
        isRecording = !isRecording;
        const recordBtn = document.querySelector('.record-btn');
        const visualizer = document.querySelector('.voice-visualizer');
        const icon = recordBtn.querySelector('i');
        
        if (isRecording) {
            recordBtn.classList.add('recording');
            visualizer.classList.remove('stopped');
            visualizer.classList.add('recording');
            icon.className = 'fas fa-stop';
            recordBtn.style.background = 'linear-gradient(135deg, #ff4757, #c44569)';
        } else {
            recordBtn.classList.remove('recording');
            visualizer.classList.remove('recording');
            visualizer.classList.add('stopped');
            icon.className = 'fas fa-microphone';
            recordBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff4757)';
        }
    }
    
    // Post Production Modal Animations
    function initPostModal() {
        const postModal = document.getElementById('post-modal');
        if (!postModal) return;
        
        // Add timeline animation
        const showcase = postModal.querySelector('.project-showcase');
        if (showcase) {
            showcase.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02) translateX(10px)';
            });
            
            showcase.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateX(0)';
            });
        }
    }
    
    // Initialize all modals
    const modals = ['video-modal', 'design-modal', 'post-modal', 'voice-modal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display !== 'none' && modal.style.display !== '') {
                            setTimeout(() => {
                                switch(modalId) {
                                    case 'video-modal':
                                        initVideoModal();
                                        break;
                                    case 'design-modal':
                                        initDesignModal();
                                        break;
                                    case 'post-modal':
                                        initPostModal();
                                        break;
                                    case 'voice-modal':
                                        initVoiceModal();
                                        break;
                                }
                            }, 100);
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        }
    });
    
    // Add floating particles effect
    function createFloatingParticles(container) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = 'rgba(138, 43, 226, 0.6)';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.pointerEvents = 'none';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 10000);
        }
    }
    
    // Enhanced modal opening animations
    const originalOpenModal = window.openModal;
    window.openModal = function(modalId) {
        if (originalOpenModal) {
            originalOpenModal(modalId);
        }
        
        setTimeout(() => {
            const modal = document.getElementById(modalId);
            if (modal) {
                createFloatingParticles(modal.querySelector('.modal-content'));
            }
        }, 500);
    };
});

// Add floating animation CSS
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatingStyle);

// Enhanced Purple Theme Particle System
document.addEventListener('DOMContentLoaded', function() {
    
    // Purple-themed floating particles
    function createPurpleFloatingParticles(container) {
        const purpleColors = [
            'rgba(138, 43, 226, 0.8)',
            'rgba(147, 112, 219, 0.7)',
            'rgba(186, 85, 211, 0.6)',
            'rgba(148, 0, 211, 0.7)',
            'rgba(123, 104, 238, 0.6)'
        ];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.position = 'absolute';
            particle.style.width = (Math.random() * 6 + 3) + 'px';
            particle.style.height = particle.style.width;
            particle.style.borderRadius = '50%';
            particle.style.background = purpleColors[Math.floor(Math.random() * purpleColors.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.pointerEvents = 'none';
            particle.style.animation = `float ${4 + Math.random() * 3}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.8)';
            particle.style.zIndex = '0';
            
            container.appendChild(particle);
            
            // Remove particle after animation cycle
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 15000);
        }
    }
    
    // Enhanced color burst with purple theme
    function createPurpleColorBurst(element) {
        const purpleColors = ['#8a2be2', '#4b0082', '#9370db', '#ba55d3', '#7b68ee'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            const angle = (360 / 12) * i;
            const distance = 80;
            
            particle.style.position = 'absolute';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.borderRadius = '50%';
            particle.style.background = purpleColors[Math.floor(Math.random() * purpleColors.length)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.boxShadow = '0 0 6px rgba(138, 43, 226, 0.8)';
            
            element.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(1)', 
                    opacity: 1,
                    boxShadow: '0 0 6px rgba(138, 43, 226, 0.8)'
                },
                { 
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(0)`,
                    opacity: 0,
                    boxShadow: '0 0 20px rgba(138, 43, 226, 0.4)'
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Override the original color burst function
    window.createColorBurst = createPurpleColorBurst;
    
    // Enhanced modal opening with purple particles
    const originalOpenModal = window.openModal;
    window.openModal = function(modalId) {
        if (originalOpenModal) {
            originalOpenModal(modalId);
        }
        
        setTimeout(() => {
            const modal = document.getElementById(modalId);
            if (modal) {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    createPurpleFloatingParticles(modalContent);
                    
                    // Add continuous particle generation
                    const particleInterval = setInterval(() => {
                        if (modal.style.display !== 'none' && modal.style.display !== '') {
                            createPurpleFloatingParticles(modalContent);
                        } else {
                            clearInterval(particleInterval);
                        }
                    }, 5000);
                }
            }
        }, 500);
    };
});

// Smooth Background Particle System
class SmoothParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = true;
        this.particleCount = this.getOptimalParticleCount();
        
        this.init();
    }
    
    getOptimalParticleCount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const area = width * height;
        const isMobile = width <= 768;
        
        // Adjust particle count based on screen size and device
        if (isMobile) {
            return Math.floor(area / 50000); // Fewer particles on mobile
        } else {
            return Math.floor(area / 30000); // More particles on desktop
        }
    }
    
    init() {
        this.createContainer();
        this.generateParticles();
        this.startAnimation();
        this.setupEventListeners();
    }
    
    createContainer() {
        // Remove existing container if it exists
        const existingContainer = document.querySelector('.particle-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        document.body.appendChild(this.container);
    }
    
    generateParticles() {
        const particleSizes = ['particle-extra-small', 'particle-small', 'particle-medium', 'particle-large'];
        const animationTypes = ['particle-float-1', 'particle-float-2', 'particle-float-3', 'particle-float-4', 'particle-float-5'];
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'background-particle';
            
            // Random size
            const randomSize = particleSizes[Math.floor(Math.random() * particleSizes.length)];
            particle.classList.add(randomSize);
            
            // Random animation type
            const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
            particle.classList.add(randomAnimation);
            
            // Random position and timing
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 15) + 's';
            
            // Random horizontal movement
            particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    startAnimation() {
        const animate = () => {
            if (!this.isActive) return;
            
            // Continuously add new particles
            if (Math.random() < 0.02) { // 2% chance each frame
                this.addSingleParticle();
            }
            
            // Clean up old particles
            this.cleanupParticles();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    addSingleParticle() {
        if (this.particles.length >= this.particleCount * 2) return; // Limit total particles
        
        const particle = document.createElement('div');
        particle.className = 'background-particle';
        
        const particleSizes = ['particle-extra-small', 'particle-small', 'particle-medium', 'particle-large'];
        const animationTypes = ['particle-float-1', 'particle-float-2', 'particle-float-3', 'particle-float-4', 'particle-float-5'];
        
        const randomSize = particleSizes[Math.floor(Math.random() * particleSizes.length)];
        const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
        
        particle.classList.add(randomSize);
        particle.classList.add(randomAnimation);
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
        particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            this.removeParticle(particle);
        }, 30000);
    }
    
    cleanupParticles() {
        this.particles = this.particles.filter(particle => {
            if (!particle.parentNode) {
                return false;
            }
            
            const rect = particle.getBoundingClientRect();
            if (rect.top < -100) { // Particle has moved off screen
                this.removeParticle(particle);
                return false;
            }
            
            return true;
        });
    }
    
    removeParticle(particle) {
        if (particle && particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }
    
    setupEventListeners() {
        // Pause/resume on visibility change
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) {
                this.startAnimation();
            } else {
                cancelAnimationFrame(this.animationId);
            }
        });
        
        // Adjust particle count on resize
        window.addEventListener('resize', () => {
            this.particleCount = this.getOptimalParticleCount();
        });
        
        // Pause particles when user is inactive
        let inactiveTimer;
        const resetInactiveTimer = () => {
            clearTimeout(inactiveTimer);
            this.isActive = true;
            
            inactiveTimer = setTimeout(() => {
                this.isActive = false;
                cancelAnimationFrame(this.animationId);
            }, 300000); // Pause after 5 minutes of inactivity
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactiveTimer, true);
        });
        
        resetInactiveTimer();
    }
    
    // Public methods
    pause() {
        this.isActive = false;
        cancelAnimationFrame(this.animationId);
    }
    
    resume() {
        this.isActive = true;
        this.startAnimation();
    }
    
    destroy() {
        this.isActive = false;
        cancelAnimationFrame(this.animationId);
        if (this.container) {
            this.container.remove();
        }
        this.particles = [];
    }
    
    updateParticleCount(count) {
        this.particleCount = count;
        this.destroy();
        this.init();
    }
}

// Initialize the smooth particle system
document.addEventListener('DOMContentLoaded', function() {
    // Wait for page to load completely
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.smoothParticles = new SmoothParticleSystem();
            console.log('✨ Smooth particle system initialized');
        }, 500);
    });
});

// Performance monitoring and adjustment
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) { // Check every second
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust particles based on performance
        if (window.smoothParticles) {
            if (fps < 30) { // If FPS is too low
                const currentCount = window.smoothParticles.particleCount;
                window.smoothParticles.updateParticleCount(Math.max(5, currentCount * 0.8));
                console.log('🔧 Reduced particles for better performance');
            } else if (fps > 55) { // If performance is good
                const currentCount = window.smoothParticles.particleCount;
                const optimalCount = window.smoothParticles.getOptimalParticleCount();
                if (currentCount < optimalCount) {
                    window.smoothParticles.updateParticleCount(Math.min(optimalCount, currentCount * 1.1));
                }
            }
        }
    }
    
    requestAnimationFrame(monitorPerformance);
}

// Start performance monitoring after initialization
setTimeout(() => {
    monitorPerformance();
}, 2000);

// Updated Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Portfolio filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterBtns.forEach(button => button.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Add ripple effect to button
            createButtonRipple(this);
        });
    });
    
    function createButtonRipple(button) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Social links click tracking (optional analytics)
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.href.includes('instagram') ? 'Instagram' :
                           this.href.includes('facebook') ? 'Facebook' :
                           this.href.includes('tiktok') ? 'TikTok' :
                           this.href.includes('twitter') ? 'Twitter' :
                           this.href.includes('youtube') ? 'YouTube' :
                           this.href.includes('linkedin') ? 'LinkedIn' : 'Unknown';
            
            console.log(`Clicked on ${platform} social link`);
            
            // Add click effect
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1) translateY(-3px)';
            }, 100);
        });
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Functional Music Player
class MusicPlayer {
    constructor() {
        this.audio = null;
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.tracks = [
    {
        title: "Alee seyaa",
        artist: "Dileep Dilhara",
        genre: "Your Genre",
        duration: "2:57", // Update with actual duration
        cover: "assets/images/Alee Seyaa.jpg", // Your cover image
        src: "assets/audio/Alee Seyaa.mp3"
    },
    {
        title: "Ambula Me gedi",
        artist: "Pubudu Bawantha & Ashini jayathilaka",
        genre: "YOYO Music Lab",
        duration: "4:12",
        cover: "assets/images/Ambula Me Gedi.jpg",
        src: "assets/audio/Ambula Me Gedi.mp3"
    },
    {
        title: "Sithin Athata",
        artist: "Pubudu Bawantha",
        genre: "YOYO Music Lab",
        duration: "4:38",
        cover: "assets/images/Sithin Athata.jpg",
        src: "assets/audio/Sithin Athata.mp3"
    }
    // Add as many songs as you want
];
       
        
        this.init();
    }
    
    init() {
        this.audio = document.getElementById('audio-player');
        if (!this.audio) return;
        
        this.setupEventListeners();
        this.renderPlaylist();
        this.updateTrackInfo();
    }
    
    setupEventListeners() {
        // Play/Pause button
        const playBtn = document.getElementById('play-btn');
        playBtn.addEventListener('click', () => this.togglePlay());
        
        // Previous/Next buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.previousTrack());
        document.getElementById('next-btn').addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        const progressBar = document.getElementById('progress-bar');
        progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Shuffle button
        document.getElementById('shuffle-btn').addEventListener('click', () => this.toggleShuffle());
        
        // Add song button
        document.getElementById('add-song-btn').addEventListener('click', () => {
            document.getElementById('song-input').click();
        });
        
        // File input
        document.getElementById('song-input').addEventListener('change', (e) => this.addSongs(e.files));
        
        // Album cover click
        document.querySelector('.album-cover').addEventListener('click', () => this.togglePlay());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        // Set initial volume
        this.audio.volume = 0.7;
    }
    
    renderPlaylist() {
        const container = document.getElementById('playlist-container');
        container.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentTrack) item.classList.add('active');
            
            item.innerHTML = `
                <span class="track-name">${track.title}</span>
                <span class="track-duration">${track.duration}</span>
            `;
            
            item.addEventListener('click', () => this.playTrack(index));
            container.appendChild(item);
        });
    }
    
    updateTrackInfo() {
        const track = this.tracks[this.currentTrack];
        if (!track) return;
        
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('track-artist').textContent = track.artist;
        document.getElementById('track-genre').textContent = track.genre;
        document.getElementById('album-image').src = track.cover;
        
        this.audio.src = track.src;
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updateWaveform();
        }).catch(e => this.handleError(e));
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateWaveform();
    }
    
    playTrack(index) {
        this.currentTrack = index;
        this.updateTrackInfo();
        this.renderPlaylist();
        this.play();
    }
    
    nextTrack() {
        if (this.isShuffled) {
            this.currentTrack = Math.floor(Math.random() * this.tracks.length);
        } else {
            this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        }
        this.updateTrackInfo();
        this.renderPlaylist();
        if (this.isPlaying) this.play();
    }
    
    previousTrack() {
        this.currentTrack = this.currentTrack === 0 ? this.tracks.length - 1 : this.currentTrack - 1;
        this.updateTrackInfo();
        this.renderPlaylist();
        if (this.isPlaying) this.play();
    }
    
    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percentage * this.audio.duration;
    }
    
    setVolume(value) {
        this.audio.volume = value / 100;
        this.updateVolumeIcon(value);
    }
    
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('shuffle-btn');
        shuffleBtn.classList.toggle('active', this.isShuffled);
    }
    
    addSongs(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                const audio = new Audio(url);
                
                audio.addEventListener('loadedmetadata', () => {
                    const track = {
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        artist: "Custom Upload",
                        genre: "User Upload",
                        duration: this.formatTime(audio.duration),
                        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                        src: url
                    };
                    
                    this.tracks.push(track);
                    this.renderPlaylist();
                });
            }
        });
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            playBtn.classList.add('playing');
        } else {
            icon.className = 'fas fa-play';
            playBtn.classList.remove('playing');
        }
    }
    
    updateWaveform() {
        const waveform = document.querySelector('.waveform');
        if (this.isPlaying) {
            waveform.classList.add('playing');
            waveform.classList.remove('paused');
        } else {
            waveform.classList.add('paused');
            waveform.classList.remove('playing');
        }
    }
    
    updateProgress() {
        if (!this.audio.duration) return;
        
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress-fill').style.width = percentage + '%';
        document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        document.getElementById('total-time').textContent = this.formatTime(this.audio.duration);
    }
    
    updateVolumeIcon(value) {
        const icon = document.querySelector('.volume-icon');
        if (value == 0) {
            icon.className = 'fas fa-volume-mute volume-icon';
        } else if (value < 50) {
            icon.className = 'fas fa-volume-down volume-icon';
        } else {
            icon.className = 'fas fa-volume-up volume-icon';
        }
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    handleError(e) {
        console.error('Audio error:', e);
        // You can add user-friendly error handling here
    }
}

// Initialize music player when modal opens
document.addEventListener('DOMContentLoaded', function() {
    let musicPlayer = null;
    
    const musicModal = document.getElementById('music-modal');
    if (musicModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (musicModal.style.display !== 'none' && musicModal.style.display !== '') {
                        if (!musicPlayer) {
                            setTimeout(() => {
                                musicPlayer = new MusicPlayer();
                            }, 500);
                        }
                    }
                }
            });
        });
        
        observer.observe(musicModal, { attributes: true });
    }
});

// Theme toggle (Dark/Light) with persistence + system preference
(function() {
  const STORAGE_KEY = 'yoyo-theme';
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const icon = btn.querySelector('i');

  function applyTheme(theme, save = false) {
    document.body.setAttribute('data-theme', theme);
    // Icon and labels
    if (theme === 'light') {
      icon.className = 'fas fa-sun';
      btn.title = 'Switch to dark mode';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      icon.className = 'fas fa-moon';
      btn.title = 'Switch to light mode';
      btn.setAttribute('aria-label', 'Switch to light mode');
    }
    if (save) localStorage.setItem(STORAGE_KEY, theme);
  }

  // Initial theme: saved > system > dark
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startTheme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(startTheme, !saved);

  // Click to toggle
  btn.addEventListener('click', () => {
    const next = (document.body.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    applyTheme(next, true);
  });

  // If user hasn't chosen, follow system changes live
  if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', (e) => applyTheme(e.matches ? 'dark' : 'light'));
  }
})();

// Reviews & Ratings (localStorage)
(function() {
  const STORAGE_KEY = 'yoyo-reviews-v1';
  const form = document.getElementById('review-form');
  const nameEl = document.getElementById('reviewer-name');
  const emailEl = document.getElementById('reviewer-email');
  const ratingHidden = document.getElementById('rating');
  const textEl = document.getElementById('review-text');
  const starInput = document.getElementById('star-input');

  const avgScoreEl = document.getElementById('avg-score');
  const avgStarsEl = document.getElementById('avg-stars');
  const totalReviewsEl = document.getElementById('total-reviews');
  const distContainer = document.getElementById('summary-distribution');

  const sortEl = document.getElementById('reviews-sort');
  const filterEl = document.getElementById('reviews-filter');
  const searchEl = document.getElementById('reviews-search');
  const listEl = document.getElementById('reviews-list');
  const loadMoreBtn = document.getElementById('load-more-reviews');

  let allReviews = loadReviews();
  let visibleCount = 6;

  // Star input logic
  starInput?.addEventListener('click', (e) => {
    const btn = e.target.closest('.star');
    if (!btn) return;
    const value = Number(btn.dataset.value || 0);
    setFormStars(value);
  });

  function setFormStars(value) {
    ratingHidden.value = value;
    starInput.querySelectorAll('.star').forEach((s) => {
      const v = Number(s.dataset.value);
      const icon = s.querySelector('i');
      if (v <= value) {
        s.classList.add('filled');
        icon.className = 'fa-solid fa-star';
        s.setAttribute('aria-checked', 'true');
      } else {
        s.classList.remove('filled');
        icon.className = 'fa-regular fa-star';
        s.setAttribute('aria-checked', 'false');
      }
    });
  }

  // Submit handler
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (nameEl.value || '').trim();
    const email = (emailEl.value || '').trim();
    const rating = Number(ratingHidden.value || 0);
    const text = (textEl.value || '').trim();

    if (!name || !text || rating < 1) {
      alert('Please add your name, select a rating, and write a review.');
      return;
    }

    const review = {
      id: Date.now(),
      name: name.substring(0, 40),
      email: email.substring(0, 80),
      rating,
      text: text.substring(0, 800),
      date: new Date().toISOString()
    };

    allReviews.unshift(review);
    saveReviews(allReviews);
    form.reset();
    setFormStars(0);
    render();
  });

  // Sorting/filtering/search
  sortEl?.addEventListener('change', render);
  filterEl?.addEventListener('change', render);
  searchEl?.addEventListener('input', () => { render(true); });

  loadMoreBtn?.addEventListener('click', () => {
    visibleCount += 6;
    render();
  });

  function render(resetVisible = false) {
    if (resetVisible) visibleCount = 6;

    // Filter
    let rows = [...allReviews];
    const filter = filterEl?.value || 'all';
    if (filter !== 'all') {
      const min = Number(filter);
      rows = rows.filter(r => r.rating >= min);
    }

    // Search
    const q = (searchEl?.value || '').toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
      );
    }

    // Sort
    const sort = sortEl?.value || 'newest';
    rows.sort((a, b) => {
      if (sort === 'highest') return b.rating - a.rating || new Date(b.date) - new Date(a.date);
      if (sort === 'lowest') return a.rating - b.rating || new Date(b.date) - new Date(a.date);
      return new Date(b.date) - new Date(a.date); // newest
    });

    // Summary
    renderSummary(rows.length ? rows : allReviews);

    // List
    listEl.innerHTML = '';
    const slice = rows.slice(0, visibleCount);
    slice.forEach(r => listEl.appendChild(reviewItem(r)));
    loadMoreBtn.style.display = rows.length > visibleCount ? 'inline-flex' : 'none';

    // If no reviews, show placeholder
    if (rows.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'review-item';
      empty.innerHTML = '<div class="review-text">No reviews match your filters yet.</div>';
      listEl.appendChild(empty);
    }
  }

  function renderSummary(rows) {
    const count = rows.length;
    const avg = count ? (rows.reduce((s, r) => s + r.rating, 0) / count) : 0;
    avgScoreEl.textContent = avg.toFixed(1);
    totalReviewsEl.textContent = String(allReviews.length);
    avgStarsEl.innerHTML = starDisplay(avg);

    // distribution
    const buckets = [0,0,0,0,0];
    allReviews.forEach(r => buckets[r.rating - 1]++);
    distContainer.innerHTML = '';
    for (let i = buckets.length; i >= 1; i--) {
      const row = document.createElement('div');
      row.className = 'dist-row';
      row.innerHTML = `
        <div>${i}★</div>
        <div class="bar"><div class="fill" style="width:${percent(buckets[i-1], allReviews.length)}%"></div></div>
        <div>${buckets[i-1]}</div>
      `;
      distContainer.appendChild(row);
    }
  }

  function percent(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  function starDisplay(value) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const out = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= full) out.push('<i class="fa-solid fa-star"></i>');
      else if (i === full + 1 && half) out.push('<i class="fa-solid fa-star-half-stroke"></i>');
      else out.push('<i class="fa-regular fa-star"></i>');
    }
    return `<div class="star-display">${out.join('')}</div>`;
  }

  function reviewItem(r) {
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-header">
        <div class="review-author">${escapeHTML(r.name)}</div>
        <div class="review-stars" aria-label="${r.rating} out of 5">${starDisplay(r.rating)}</div>
        <div class="review-date">${formatDate(r.date)}</div>
      </div>
      <div class="review-text">${escapeHTML(r.text)}</div>
    `;
    return item;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  }

  function loadReviews() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      // validate
      return Array.isArray(arr) ? arr.filter(v => v && typeof v.rating === 'number') : [];
    } catch { return []; }
  }
  function saveReviews(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
    catch {}
  }

  // Initial render
  setFormStars(0);
  render();
})();

// Studio Tour modal (MP4 or YouTube/Vimeo)
(function(){
  const trigger = document.getElementById('studio-tour');
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    const src = trigger.getAttribute('data-video');
    if (!src) return;
    openVideoModal(src);
  });

  function openVideoModal(src){
    const modal = document.createElement('div');
    modal.className = 'video-modal';

    const content = document.createElement('div');
    content.className = 'video-modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-video-btn';
    closeBtn.innerHTML = '&times;';

    const wrapper = document.createElement('div');
    wrapper.className = 'video-container';

    // Build player (HTML5 video or iframe for YouTube/Vimeo)
    if (isYouTube(src)) {
      const id = getYouTubeId(src);
      wrapper.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else if (isVimeo(src)) {
      const id = getVimeoId(src);
      wrapper.innerHTML = `
        <iframe
          src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else {
      // Assume direct video file
      wrapper.innerHTML = `
        <video controls autoplay playsinline>
          <source src="${src}" type="${guessType(src)}">
          Your browser does not support the video tag.
        </video>`;
    }

    content.appendChild(closeBtn);
    content.appendChild(wrapper);
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Close handlers
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', escClose);

    function close(){
      // Pause video element if present before removing
      const vid = modal.querySelector('video');
      if (vid) {
        try { vid.pause(); } catch {}
      }
      document.removeEventListener('keydown', escClose);
      document.body.classList.remove('modal-open');
      modal.remove();
    }
    function escClose(e){ if (e.key === 'Escape') close(); }
  }

  function guessType(url){
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
    return 'video/mp4';
  }

  function isYouTube(url){
    return /youtube\.com|youtu\.be/.test(url);
  }
  function getYouTubeId(url){
    // supports youtu.be/ID and youtube.com/watch?v=ID
    const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : url;
  }

  function isVimeo(url){
    return /vimeo\.com/.test(url);
  }
  function getVimeoId(url){
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : url;
  }
})();

// Studio Tour modal (unique class; no conflicts)
(function(){
  const trigger = document.getElementById('studio-tour');
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    const src = trigger.getAttribute('data-video');
    if (!src) return;
    openStudioModal(src);
  });

  function openStudioModal(src){
    const modal = document.createElement('div');
    modal.className = 'studio-modal';

    const content = document.createElement('div');
    content.className = 'studio-modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'studio-close';
    closeBtn.innerHTML = '&times;';

    const frame = document.createElement('div');
    frame.className = 'studio-frame';

    if (isYouTube(src)) {
      frame.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${getYouTubeId(src)}?autoplay=1&rel=0&modestbranding=1"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else if (isVimeo(src)) {
      frame.innerHTML = `
        <iframe
          src="https://player.vimeo.com/video/${getVimeoId(src)}?autoplay=1&title=0&byline=0&portrait=0"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else {
      // Direct file (mp4/webm/ogg)
      frame.innerHTML = `
        <video controls autoplay playsinline>
          <source src="${src}" type="${guessType(src)}">
          Your browser does not support the video tag.
        </video>`;
    }

    content.appendChild(closeBtn);
    content.appendChild(frame);
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Close behaviors
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', escClose);

    function close(){
      const vid = modal.querySelector('video');
      if (vid) { try { vid.pause(); } catch(e){} }
      document.removeEventListener('keydown', escClose);
      document.body.classList.remove('modal-open');
      modal.remove();
    }
    function escClose(e){ if (e.key === 'Escape') close(); }
  }

  function guessType(url){
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
    return 'video/mp4';
  }
  function isYouTube(url){ return /youtube\.com|youtu\.be/.test(url); }
  function getYouTubeId(url){
    const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : url;
  }
  function isVimeo(url){ return /vimeo\.com/.test(url); }
  function getVimeoId(url){
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : url;
  }
})();

// Studio Tour modal — one tap open, one tap close, no re-open
(function () {
  const trigger = document.getElementById('studio-tour');
  if (!trigger) return;

  let suppressOpen = false;

  // 1) Stop any old click handlers on .image-overlay from running
  //    (capture phase so we intercept before others)
  trigger.addEventListener('click', function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }, true);

  // 2) Open on pointerdown for instant response
  trigger.addEventListener('pointerdown', (e) => {
    if (suppressOpen) { e.preventDefault(); e.stopPropagation(); return; }
    const src = trigger.getAttribute('data-video');
    if (!src) return;
    openStudioModal(src);
  });

  function openStudioModal(src) {
    // Avoid duplicates
    if (document.querySelector('.studio-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'studio-modal';

    const content = document.createElement('div');
    content.className = 'studio-modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'studio-close';
    closeBtn.setAttribute('aria-label', 'Close video');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    const frame = document.createElement('div');
    frame.className = 'studio-frame';

    if (isYouTube(src)) {
      frame.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${getYouTubeId(src)}?autoplay=1&rel=0&modestbranding=1"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else if (isVimeo(src)) {
      frame.innerHTML = `
        <iframe
          src="https://player.vimeo.com/video/${getVimeoId(src)}?autoplay=1&title=0&byline=0&portrait=0"
          title="Studio Tour"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    } else {
      frame.innerHTML = `
        <video controls autoplay playsinline>
          <source src="${src}" type="${guessType(src)}">
          Your browser does not support the video tag.
        </video>`;
    }

    content.append(closeBtn, frame);
    modal.append(content);
    document.body.append(modal);
    document.body.classList.add('modal-open');

    // Instant close on pointerdown, and prevent bubbling
    const onCloseNow = (e) => { e.preventDefault(); e.stopPropagation(); doClose(); };
    closeBtn.addEventListener('pointerdown', onCloseNow, { once: true });
    // Safe fallback if pointerdown isn’t supported (older browsers)
    closeBtn.addEventListener('click', onCloseNow, { once: true });

    // Click on overlay closes (but not inside content)
    modal.addEventListener('pointerdown', (e) => {
      if (e.target === modal) { e.preventDefault(); e.stopPropagation(); doClose(); }
    });

    // ESC key closes
    const onEsc = (e) => { if (e.key === 'Escape') doClose(); };
    document.addEventListener('keydown', onEsc);

    let closed = false;
    function doClose() {
      if (closed) return;
      closed = true;

      // Pause and release HTML5 video
      const vid = modal.querySelector('video');
      if (vid) { try { vid.pause(); vid.src = ''; } catch (err) {} }

      document.removeEventListener('keydown', onEsc);
      document.body.classList.remove('modal-open');
      modal.remove();

      // Suppress re-open from the same tap/click that just closed
      suppressOpen = true;
      trigger.style.pointerEvents = 'none';
      setTimeout(() => {
        suppressOpen = false;
        trigger.style.pointerEvents = '';
      }, 250);
    }
  }

  function guessType(url) {
    const ext = (url.split('.').pop() || '').toLowerCase();
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
    return 'video/mp4';
  }
  function isYouTube(url) { return /youtube\.com|youtu\.be/.test(url); }
  function getYouTubeId(url) {
    const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : url;
  }
  function isVimeo(url) { return /vimeo\.com/.test(url); }
  function getVimeoId(url) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : url;
  }
})();

// Design Galleries (Logo / Posts / T-Shirts)
document.addEventListener('DOMContentLoaded', function () {
  // Replace these arrays with your real image paths
  const designSets = {
    logos: [
      // Example placeholders — replace with your logo images
        'assets/design/logos/logo-01.jpg',
    'assets/design/logos/logo-02.jpg',
    'assets/design/logos/logo-03.jpg',
    'assets/design/logos/logo-04.png',
    'assets/design/logos/logo-05.png'
    ],
    posts: [
      'assets/design/posts/1.webp',
      'assets/design/posts/2.png',
      'assets/design/posts/3.webp',
      'assets/design/posts/4.png'
    ],
    tshirts: [
      // Added one image for now; add more later (assets/design/tshirts/...)
      'assets/design/tshirts/1.png',
      'assets/design/tshirts/2.png',
      'assets/design/tshirts/3.png',
      'assets/design/tshirts/4.jpg'
    ]
    
  };

  // Open gallery when clicking a design item
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.portfolio-item[data-collection]');
    if (!item) return;

    // Only respond if the item is currently visible (not display:none)
    if (getComputedStyle(item).display === 'none') return;

    const collection = item.getAttribute('data-collection');
    openDesignGallery(collection);
  });

  function openDesignGallery(collection) {
    const images = designSets[collection] || [];
    if (!images.length) {
      alert('No images added yet for this collection.');
      return;
    }

    // Build modal
    const modal = document.createElement('div');
    modal.className = 'design-gallery-modal';

    const content = document.createElement('div');
    content.className = 'design-gallery-content';

    const header = document.createElement('div');
    header.className = 'design-gallery-header';

    const title = document.createElement('h4');
    title.className = 'design-gallery-title';
    title.textContent = collectionTitle(collection);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'design-gallery-close';
    closeBtn.setAttribute('aria-label','Close');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    header.append(title, closeBtn);

    const body = document.createElement('div');
    body.className = 'design-gallery-body';

    const grid = document.createElement('div');
    grid.className = 'design-gallery-grid';

    images.forEach(src => {
      const cell = document.createElement('div');
      cell.className = 'design-thumb';
      const img = document.createElement('img');
      img.src = src;
      img.alt = collectionTitle(collection);
      cell.appendChild(img);
      grid.appendChild(cell);

      // Lightbox on click
      cell.addEventListener('click', () => openLightbox(src));
    });

    body.appendChild(grid);
    content.append(header, body);
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Close handlers
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', escClose);

    function escClose(e){ if (e.key === 'Escape') close(); }
    function close(){
      document.removeEventListener('keydown', escClose);
      document.body.classList.remove('modal-open');
      modal.remove();
    }
  }

  function openLightbox(src) {
    const lb = document.createElement('div');
    lb.className = 'design-lightbox';
    const img = document.createElement('img');
    img.src = src;
    lb.appendChild(img);
    document.body.appendChild(lb);

    const close = () => lb.remove();
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function onEsc(e){
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
    });
  }

  function collectionTitle(key) {
    if (key === 'logos') return 'Logo Concepts';
    if (key === 'posts') return 'Social Post Series';
    if (key === 'tshirts') return 'T‑Shirt Designs';
    return 'Gallery';
  }
});

