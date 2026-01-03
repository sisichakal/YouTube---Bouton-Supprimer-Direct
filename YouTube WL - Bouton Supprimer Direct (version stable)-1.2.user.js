// ==UserScript==
// @name         _YouTube WL - Bouton Supprimer Direct (version corrigée 2025)
// @namespace    yt-wl-delete
// @version      2.0
// @description  Bouton "🗑" pour supprimer directement les vidéos de la playlist "À regarder plus tard"
// @match        https://www.youtube.com/playlist?list=WL*
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Inject delete buttons next to video menu
     */
    function injectButtons() {
        const aVideos = document.querySelectorAll('ytd-playlist-video-renderer');

        aVideos.forEach(oVideo => {
            // Skip if button already exists
            if (oVideo.querySelector('.direct-delete-btn')) {
                return;
            }

            const oMenu = oVideo.querySelector('#menu ytd-menu-renderer');
            if (!oMenu) {
                return;
            }

            // Create delete button
            const oButton = document.createElement('button');
            oButton.textContent = '🗑';
            oButton.className = 'direct-delete-btn';
            oButton.title = 'Supprimer de la playlist';
            oButton.style.cssText = `
                margin-left: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 18px;
                color: #ff0000;
                padding: 8px;
                border-radius: 50%;
                transition: background-color 0.2s;
            `;

            // Hover effect
            oButton.addEventListener('mouseenter', () => {
                oButton.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            });
            oButton.addEventListener('mouseleave', () => {
                oButton.style.backgroundColor = 'transparent';
            });

            // Click handler
            oButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                event.preventDefault();

                // Disable button during operation
                oButton.disabled = true;
                oButton.style.opacity = '0.5';

                try {
                    // Find and click the three-dot menu button
                    const oThreeDotsButton = oVideo.querySelector(
                        'ytd-menu-renderer yt-icon-button button, ' +
                        'ytd-menu-renderer button[aria-label]'
                    );

                    if (!oThreeDotsButton) {
                        console.error('Three-dot menu button not found');
                        return;
                    }

                    // Open menu
                    oThreeDotsButton.click();

                    // Wait for menu to appear
                    await waitForElement('ytd-menu-service-item-renderer', 1000);

                    // Find the delete menu item
                    const aMenuItems = Array.from(
                        document.querySelectorAll('ytd-menu-service-item-renderer tp-yt-paper-item')
                    );

                    const oDeleteItem = aMenuItems.find(oItem => {
                        const sText = oItem.innerText || oItem.textContent || '';
                        return sText.includes('Supprimer de') ||
                               sText.includes('Supprimer') ||
                               sText.toLowerCase().includes('remove');
                    });

                    if (oDeleteItem) {
                        oDeleteItem.click();
                        console.log('Video removed from playlist');
                    } else {
                        console.error('Delete button not found in menu');
                        // Close menu if delete not found
                        document.body.click();
                    }

                } catch (error) {
                    console.error('Error removing video:', error);
                } finally {
                    // Re-enable button
                    oButton.disabled = false;
                    oButton.style.opacity = '1';
                }
            });

            // Append button to menu
            oMenu.appendChild(oButton);
        });
    }

    /**
     * Wait for an element to appear in the DOM
     * @param {string} selector - CSS selector
     * @param {number} timeout - Maximum wait time in ms
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkExist = setInterval(() => {
                const oElement = document.querySelector(selector);

                if (oElement) {
                    clearInterval(checkExist);
                    resolve(oElement);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkExist);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }, 100);
        });
    }

    /**
     * Initialise the script
     */
    function initialise() {
        // Initial injection
        injectButtons();

        // Periodic re-injection for dynamically loaded content
        setInterval(injectButtons, 3000);

        // Observe DOM changes for new videos
        const oObserver = new MutationObserver((aMutations) => {
            // Debounce: only inject if there are actual changes
            const bHasVideoChanges = aMutations.some(oMutation => {
                return Array.from(oMutation.addedNodes).some(oNode => {
                    return oNode.nodeName === 'YTD-PLAYLIST-VIDEO-RENDERER' ||
                           (oNode.querySelector && oNode.querySelector('ytd-playlist-video-renderer'));
                });
            });

            if (bHasVideoChanges) {
                setTimeout(injectButtons, 500);
            }
        });

        // Start observing
        const oTarget = document.querySelector('ytd-playlist-video-list-renderer') || document.body;
        oObserver.observe(oTarget, {
            childList: true,
            subtree: true
        });

        console.log('YouTube WL Delete Button: Initialised');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise);
    } else {
        initialise();
    }
})();
