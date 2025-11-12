const btn=document.getElementById('subscribeBtn');const popup=document.getElementById('subscribePopup');const close=document.querySelector('.popup .close');btn?.addEventListener('click',()=>popup.style.display='block');close?.addEventListener('click',()=>popup.style.display='none');popup?.addEventListener('click',e=>{if(e.target===popup)popup.style.display='none'});

// Link preview on hover
let previewWindow = null;
let previewTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('article a[href^="http"]');

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const url = link.getAttribute('href');

      previewTimeout = setTimeout(() => {
        // Create preview window
        previewWindow = document.createElement('div');
        previewWindow.className = 'link-preview';

        const browserChrome = document.createElement('div');
        browserChrome.className = 'link-preview-chrome';
        browserChrome.innerHTML = `
          <div class="link-preview-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="link-preview-url">${url}</div>
        `;

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.className = 'link-preview-frame';

        previewWindow.appendChild(browserChrome);
        previewWindow.appendChild(iframe);
        document.body.appendChild(previewWindow);

        // Position near cursor
        const rect = link.getBoundingClientRect();
        previewWindow.style.left = Math.min(e.clientX + 20, window.innerWidth - 420) + 'px';
        previewWindow.style.top = Math.min(rect.top, window.innerHeight - 320) + 'px';
      }, 500); // Delay before showing
    });

    link.addEventListener('mouseleave', () => {
      clearTimeout(previewTimeout);
      if (previewWindow) {
        previewWindow.remove();
        previewWindow = null;
      }
    });
  });
});
