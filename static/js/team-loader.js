/**
 * Team Card Loader & Template
 * This file handles the dynamic loading of team members from profiles.json.
 * Edit the HTML template literal below to change the card design.
 */

async function loadTeamCards() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  try {
    const response = await fetch('/static/data/team-members.json');
    const profiles = await response.json();
    
    let html = '';
    Object.entries(profiles).forEach(([id, data], i) => {
      const delay = i % 3 === 0 ? '' : `anim-delay-${(i % 3) * 100}`;
      const themeColor = data.themeColor || 'cyan';
      
      // Map common theme colors to their glow values
      const glowMap = {
        'cyan': '0, 209, 255',
        'purple': '165, 124, 255',
        'magenta': '255, 90, 146',
        'orange-500': '249, 115, 22',
        'green': '34, 197, 94',
        'blue': '59, 130, 246',
        'red-500': '239, 68, 68'
      };
      const glowRgb = glowMap[themeColor] || '0, 209, 255';

      /* ======================== CARD TEMPLATE START ======================== */
      html += `
        <div onclick="location.href='/profile.html?user=${id}'" class="daily-card p-8 group reveal ${delay} flex flex-col h-full cursor-pointer">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-${themeColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="relative z-10 flex items-center gap-6 mb-8 transform group-hover:-translate-y-1 transition-transform duration-500">
        <div class="relative">
          <div class="absolute inset-0 bg-${themeColor}/20 blur-xl rounded-full group-hover:bg-${themeColor}/40 transition-all duration-500"></div>
          <div class="w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(${glowRgb},0.4)] shrink-0 border border-${themeColor}/20 group-hover:border-${themeColor}/50 transition-colors relative z-10">
            <img src="${data.image}" alt="${data.name} ${data.surname || ''}, ${data.role}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-${themeColor} transition-colors">${data.name} ${data.surname || ''}</h3>
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-${themeColor}/10 border border-${themeColor}/20 text-${themeColor} text-xs font-bold tracking-wide">${data.role}</span>
        </div>
          </div>
          <p class="relative z-10 text-secondary text-sm leading-relaxed mb-6 flex-grow">${data.description}</p>
          <div class="relative z-10 flex gap-3 mt-auto" onclick="event.stopPropagation()">
        <!-- Social links removed -->
          </div>
        </div>
      `;
      /* ======================== CARD TEMPLATE END ========================== */
    });
    
    grid.innerHTML = html;
    
    // Re-initialize Scroll Reveal for new elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
  } catch (error) {
    console.error('Error loading team profiles:', error);
    grid.innerHTML = '<p class="text-red-500">Failed to load team profiles.</p>';
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadTeamCards);
