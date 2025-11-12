const btn=document.getElementById('subscribeBtn');const popup=document.getElementById('subscribePopup');const close=document.querySelector('.popup .close');btn?.addEventListener('click',()=>popup.style.display='block');close?.addEventListener('click',()=>popup.style.display='none');popup?.addEventListener('click',e=>{if(e.target===popup)popup.style.display='none'});

// Link preview on hover
let previewWindow = null;
let previewTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('article a[href]');

  let isOverLink = false;
  let isOverPreview = false;

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      isOverLink = true;
      const href = link.getAttribute('href');
      // Resolve relative URLs to absolute
      const url = new URL(href, window.location.href).href;

      previewTimeout = setTimeout(() => {
        // Close existing preview if any
        if (previewWindow) {
          previewWindow.remove();
        }

        // Create preview window
        previewWindow = document.createElement('div');
        previewWindow.className = 'link-preview';

        const browserChrome = document.createElement('div');
        browserChrome.className = 'link-preview-chrome';
        browserChrome.innerHTML = `
          <div class="link-preview-dots">
            <span class="close-preview"></span><span class="open-background"></span><span class="open-foreground"></span>
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
        previewWindow.style.left = Math.min(e.clientX + 20, window.innerWidth - 500) + 'px';
        previewWindow.style.top = Math.min(rect.top, window.innerHeight - 380) + 'px';

        // Close button functionality
        const closeBtn = previewWindow.querySelector('.close-preview');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          previewWindow.remove();
          previewWindow = null;
          isOverPreview = false;
          isOverLink = false;
        });

        // Yellow button - open in new tab (background)
        const yellowBtn = previewWindow.querySelector('.open-background');
        yellowBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(url, '_blank');
          window.focus(); // Keep focus on current window
        });

        // Green button - open in new tab and switch to it (foreground)
        const greenBtn = previewWindow.querySelector('.open-foreground');
        greenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const newTab = window.open(url, '_blank');
          if (newTab) newTab.focus();
        });

        // Track mouse over preview
        previewWindow.addEventListener('mouseenter', () => {
          isOverPreview = true;
        });

        previewWindow.addEventListener('mouseleave', () => {
          isOverPreview = false;
          // Close if not over link either
          setTimeout(() => {
            if (!isOverLink && !isOverPreview && previewWindow) {
              previewWindow.remove();
              previewWindow = null;
            }
          }, 100);
        });
      }, 500); // Delay before showing
    });

    link.addEventListener('mouseleave', () => {
      clearTimeout(previewTimeout);
      isOverLink = false;
      // Close if not over preview
      setTimeout(() => {
        if (!isOverLink && !isOverPreview && previewWindow) {
          previewWindow.remove();
          previewWindow = null;
        }
      }, 100);
    });
  });
});
