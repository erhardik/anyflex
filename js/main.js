/* ============================================
   PRINT HEAVEN - Main JavaScript
   Interactions, Animations, Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.mobile-overlay');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    if (overlay) {
      overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Close menu on nav link click
    document.querySelectorAll('.nav a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // --- Sticky Header ---
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // --- Scroll Animations ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(function(el) {
    observer.observe(el);
  });
  
  // --- Gallery Filters ---
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryFilters.length > 0) {
    galleryFilters.forEach(function(filter) {
      filter.addEventListener('click', function() {
        // Update active state
        galleryFilters.forEach(function(f) { f.classList.remove('active'); });
        this.classList.add('active');
        
        var category = this.getAttribute('data-filter');
        
        galleryItems.forEach(function(item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // --- Form Handling ---
  const inquiryForm = document.getElementById('inquiryForm');
  const designServiceSelect = document.getElementById('designService');
  const logoUploadNote = document.getElementById('logoUploadNote');
  
  if (designServiceSelect && logoUploadNote) {
    designServiceSelect.addEventListener('change', function() {
      if (this.value === 'Design + Printing both required') {
        logoUploadNote.style.display = 'block';
        logoUploadNote.style.animation = 'fadeInUp 0.3s ease';
      } else {
        logoUploadNote.style.display = 'none';
      }
    });
  }
  
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var requirement = document.getElementById('requirement').value;
      var size = document.getElementById('size') ? document.getElementById('size').value.trim() : '';
      var quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : '1';
      var designService = document.getElementById('designService') ? document.getElementById('designService').value : '';
      var details = document.getElementById('details') ? document.getElementById('details').value.trim() : '';
      
      if (!name || !phone || !requirement || !designService) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      if (parseInt(quantity) < 1) {
        showNotification('Quantity must be at least 1', 'error');
        return;
      }
      
      var phoneRegex = /^[0-9+\-\s]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
      }
      
      var message = 'Hello AnyFlex!%0A%0A';
      message += '*Name:* ' + encodeURIComponent(name) + '%0A';
      message += '*Phone:* ' + encodeURIComponent(phone) + '%0A';
      message += '*Service:* ' + encodeURIComponent(requirement) + '%0A';
      message += '*Quantity:* ' + encodeURIComponent(quantity) + '%0A';
      if (size) {
        message += '*Size:* ' + encodeURIComponent(size) + '%0A';
      }
      message += '*Design:* ' + encodeURIComponent(designService) + '%0A';
      if (details) {
        message += '*Details:* ' + encodeURIComponent(details) + '%0A';
      }
      message += '%0APlease share a quote. Thank you!';
      
      var whatsappUrl = 'https://wa.me/9188667499627?text=' + message;
      window.open(whatsappUrl, '_blank');
      
      showNotification('Redirecting to WhatsApp...', 'success');
      this.reset();
      
      if (logoUploadNote) {
        logoUploadNote.style.display = 'none';
      }
      
      var fileText = document.querySelector('.file-upload-text');
      if (fileText) {
        fileText.innerHTML = '<strong>Click to upload</strong> or drag and drop<br><span class="file-upload-hint">PDF, JPG, PNG, AI, PSD, CDR (Max 10MB)</span>';
      }
    });
  }
  
  // --- File Upload Display ---
  var fileInput = document.getElementById('fileUpload');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      var fileText = document.querySelector('.file-upload-text');
      if (this.files.length > 0) {
        var fileName = this.files[0].name;
        var fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);
        fileText.innerHTML = '<strong>' + fileName + '</strong><br><span class="file-upload-hint">' + fileSize + ' MB - Click to change</span>';
      } else {
        fileText.innerHTML = '<strong>Click to upload</strong> or drag and drop<br><span class="file-upload-hint">PDF, JPG, PNG (Max 10MB)</span>';
      }
    });
  }
  
  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // --- Counter Animation ---
  function animateCounter(element, target, duration) {
    var start = 0;
    var increment = target / (duration / 16);
    var current = start;
    
    function update() {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        return;
      }
      element.textContent = Math.floor(current) + '+';
      requestAnimationFrame(update);
    }
    
    update();
  }
  
  // Observe stat values
  var statValues = document.querySelectorAll('.hero-stat-value');
  
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var target = parseInt(entry.target.getAttribute('data-count'));
        if (target) {
          animateCounter(entry.target, target, 2000);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(function(el) {
    counterObserver.observe(el);
  });
  
  // --- Active Nav Link ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';
  
  document.querySelectorAll('.nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === '/')) {
      link.classList.add('active');
    }
  });
  
  // --- Notification System ---
  function showNotification(message, type) {
    // Remove existing notification
    var existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = message;
    notification.style.cssText = 'position:fixed;top:100px;right:24px;padding:16px 24px;border-radius:8px;color:#fff;font-weight:500;z-index:10000;animation:fadeInUp 0.3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.2);';
    
    if (type === 'success') {
      notification.style.background = '#28a745';
    } else {
      notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(function() { notification.remove(); }, 300);
    }, 3000);
  }
  
  // --- Hero Carousel ---
  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 5000;
    
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, slideInterval);
  }
  
  // --- Hero Float Cards Mouse Interaction ---
  const heroFloats = document.querySelector('.hero-floats');
  if (heroFloats) {
    const cards = heroFloats.querySelectorAll('.hero-float');
    const interactionRadius = 120;
    
    document.addEventListener('mousemove', function(e) {
      cards.forEach(function(card) {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const dx = e.clientX - cardCenterX;
        const dy = e.clientY - cardCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < interactionRadius) {
          const pushX = (dx / distance) * (interactionRadius - distance) * 0.3;
          const pushY = (dy / distance) * (interactionRadius - distance) * 0.3;
          card.style.transform = 'translate(' + (-pushX) + 'px, ' + (-pushY) + 'px) scale(1.05)';
          card.style.zIndex = '10';
        } else {
          card.style.transform = '';
          card.style.zIndex = '';
        }
      });
    });
    
    heroFloats.addEventListener('mouseleave', function() {
      cards.forEach(function(card) {
        card.style.transform = '';
        card.style.zIndex = '';
      });
    });
  }
  
  // --- Lazy Load Images (if any) ---
  var lazyImages = document.querySelectorAll('img[data-src]');
  
  var imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(function(img) {
    imageObserver.observe(img);
  });
  
});
