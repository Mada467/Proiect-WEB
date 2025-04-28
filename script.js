document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const imageCount = document.querySelectorAll('.carousel img').length;
    let currentIndex = 0;
    
    // Set initial width
    carousel.style.width = `${imageCount * 100}%`;
    document.querySelectorAll('.carousel img').forEach(img => {
      img.style.width = `${100 / imageCount}%`;
    });
    
    function goToSlide(index) {
      if (index < 0) {
        index = imageCount - 1;
      } else if (index >= imageCount) {
        index = 0;
      }
      
      carousel.style.transform = `translateX(-${index * (100 / imageCount)}%)`;
      currentIndex = index;
      
      // Update active dot
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Set up event listeners
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToSlide(index);
      });
    });
    
    // Auto-rotate every 5 seconds
    setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  });