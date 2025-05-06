/**
 * Script pentru funcționalitatea caruselului de imagini
 * 
 * Acest script se ocupă de:
 * 1. Inițializarea caruselului
 * 2. Navigarea între imaginile caruselului folosind butoanele și punctele
 * 3. Rotirea automată a imaginilor la fiecare 5 secunde
 */

// Așteptăm ca tot documentul să se încarce înainte de a executa codul
document.addEventListener('DOMContentLoaded', function() {
  // Selectăm elementele caruselului
  const carousel = document.querySelector('.carousel');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  
  // Numărăm câte imagini avem în carusel
  const imageCount = document.querySelectorAll('.carousel img').length;
  
  // Ținem evidența imaginii curente afișate
  let currentIndex = 0;
  
  // Stabilim lățimea caruselului în funcție de câte imagini avem
  // De exemplu, dacă avem 4 imagini, lățimea totală va fi 400%
  carousel.style.width = `${imageCount * 100}%`;
  
  // Setăm lățimea fiecărei imagini pentru a ocupa o parte egală din carusel
  document.querySelectorAll('.carousel img').forEach(img => {
      img.style.width = `${100 / imageCount}%`;
  });
  
  /**
   * Funcție pentru navigarea la o anumită imagine
   * @param {number} index - Indexul imaginii la care vrem să navigăm
   */
  function goToSlide(index) {
      // Verificăm să nu depășim limitele
      if (index < 0) {
          // Dacă am ajuns la prima imagine și vrem să mergem înapoi,
          // mergem la ultima imagine
          index = imageCount - 1;
      } else if (index >= imageCount) {
          // Dacă am ajuns la ultima imagine și vrem să continuăm,
          // revenim la prima imagine
          index = 0;
      }
      
      // Mutăm caruselul la poziția corectă prin transformare CSS
      carousel.style.transform = `translateX(-${index * (100 / imageCount)}%)`;
      
      // Actualizăm indexul curent
      currentIndex = index;
      
      // Actualizăm care punct de navigare este activ
      dots.forEach((dot, i) => {
          if (i === currentIndex) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
  }
  
  // Configurăm evenimentele pentru butoanele de navigare
  
  // Butonul pentru imaginea anterioară
  prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
  });
  
  // Butonul pentru imaginea următoare
  nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
  });
  
  // Configurăm evenimentele pentru punctele de navigare
  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          goToSlide(index);
      });
  });
  
  // Configurăm rotirea automată a caruselului la fiecare 8 secunde
  const autoRotate = setInterval(() => {
      goToSlide(currentIndex + 1);
  }, 8000);
  
  // Oprim rotirea automată când utilizatorul interacționează cu caruselul
  carousel.addEventListener('mouseenter', () => {
      clearInterval(autoRotate);
  });
  
  // Reluăm rotirea automată când utilizatorul nu mai interacționează cu caruselul
  carousel.addEventListener('mouseleave', () => {
      setInterval(() => {
          goToSlide(currentIndex + 1);
      }, 8000);
  });
  
  // Adăugăm suport pentru navigare cu tastatura
  document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
          goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
          goToSlide(currentIndex + 1);
      }
  });
});
let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const title = button.dataset.title;
    cart.push(title);
    updateCartUI();
  });
});

function updateCartUI() {
  document.getElementById('cart-count').textContent = cart.length;
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-modal').classList.remove('hidden');
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').classList.add('hidden');
});
