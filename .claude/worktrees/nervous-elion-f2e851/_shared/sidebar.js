/* Sidebar: scroll progress, active link highlighting, auto-scroll, mobile close */
(function(){
  // Auto-assign IDs to every section heading in document order
  var headings = document.querySelectorAll('h2.st');
  headings.forEach(function(h, i){ h.id = 's' + (i + 1); });

  var links = document.querySelectorAll('#sidebar nav a');
  var progressBar = document.getElementById('sb-progress-bar');
  var sb = document.getElementById('sidebar');
  var ticking = false;

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var scrollY = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;

      // Progress bar
      if(progressBar && docH > 0){
        progressBar.style.width = Math.min(100, (scrollY / docH) * 100) + '%';
      }

      // Active link
      var current = '';
      headings.forEach(function(h){
        if(scrollY >= h.offsetTop - 140) current = h.id;
      });
      links.forEach(function(a){
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });

      // Auto-scroll sidebar to keep active link visible
      var activeLink = sb.querySelector('nav a.active');
      if(activeLink){
        var linkTop = activeLink.offsetTop;
        var linkBot = linkTop + activeLink.offsetHeight;
        var visTop = sb.scrollTop + 90;
        var visBot = sb.scrollTop + sb.clientHeight - 50;
        if(linkTop < visTop) sb.scrollTop = linkTop - 90;
        else if(linkBot > visBot) sb.scrollTop = linkBot - sb.clientHeight + 50;
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // Close sidebar on link click (mobile)
  links.forEach(function(a){
    a.addEventListener('click', function(){
      sb.classList.remove('open');
    });
  });
})();
