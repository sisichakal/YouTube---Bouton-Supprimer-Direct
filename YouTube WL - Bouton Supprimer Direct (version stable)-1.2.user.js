// ==UserScript==
// @name         YouTube WL - Bouton Supprimer Direct (version stable)
// @namespace    yt-wl-delete
// @version      1.2
// @description  Bouton "🗑" stable pour supprimer directement les vidéos de la playlist "À regarder plus tard"
// @match        https://www.youtube.com/playlist?list=WL*
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function injectButtons() {
        const videos = document.querySelectorAll('ytd-playlist-video-renderer');
        videos.forEach(video => {
            if (video.querySelector('.direct-delete-btn')) return;

            const menu = video.querySelector('#menu');
            if (!menu) return;

            const btn = document.createElement('button');
            btn.textContent = '🗑';
            btn.className = 'direct-delete-btn';
            btn.title = 'Supprimer de la playlist';
            btn.style.cssText = `
                margin-left: 6px;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #f00;
            `;

            menu.appendChild(btn);

            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const threeDots = video.querySelector('ytd-menu-renderer yt-icon-button#button button');
                if (!threeDots) return;
                threeDots.click();

                await new Promise(r => setTimeout(r, 400));

                const items = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer'));
                const deleteBtn = items.find(el => el.innerText.includes('Supprimer de'));
                if (deleteBtn) deleteBtn.click();
            });
        });
    }

    // Réinjection régulière + observer pour changements rapides
    setInterval(injectButtons, 2000);

    const observer = new MutationObserver(() => injectButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    injectButtons();
})();
