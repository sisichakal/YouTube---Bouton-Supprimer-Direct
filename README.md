# YouTube Watch Later — one-click remove

Userscript adding a one-click remove button to the YouTube Watch Later playlist.

[![Userscript](https://img.shields.io/badge/userscript-v2.0-blue)](youtube-wl-bouton-supprimer-direct.user.js) [![No dependencies](https://img.shields.io/badge/dependencies-none-lightgrey)](#how-it-works)

Removing a video from Watch Later takes three clicks through a menu. This script makes it one.

## What it does

- Adds a delete button to every video in the Watch Later playlist.
- Removes the video directly, without going through the context menu.

## Where it runs

- `youtube.com/playlist?list=WL*`

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Open [`youtube-wl-bouton-supprimer-direct.user.js`](youtube-wl-bouton-supprimer-direct.user.js) and click **Raw**.

Tampermonkey picks up the install prompt automatically. Updates are served through `@updateURL`, so later versions are offered without reinstalling.

## How it works

A single `.user.js` file of plain DOM code: no build step, no bundler, no external library.

## Known limitations

- Selectors track the site's current markup and will need updating when it changes.
