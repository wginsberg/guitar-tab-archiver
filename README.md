# Guitar Tab Archiver

A browser extension for guitar players.

* [Download](#download)
* [About](#about)
* [Build instructions](#build)

## Download

* [Chrome extension](https://chromewebstore.google.com/detail/guitar-tab-archiver/elkcgjfobbkiffjadbifemclachelngh)
* [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/guitar-tab-archiver/)

## About

Guitar Tab Archiver is a browser extension for saving guitar tabs while you browse ultimate-guitar.com

Simply open any tab on ultimate-guitar.com and it will be saved locally. Pop open the extension and view your tabs any time, even offline, and without ads.

![](/screenshots/0.png)
![](/screenshots/3.png)
![](/screenshots/5.png)

## Build

This extension was created with the [Plasmo](https://docs.plasmo.com/) framework.

Recommended environment:
* Node 19.4.0
* pnpm 8.10.5
* MacOS 11.1 


To reproduce the build from source code perform the following steps:
```
pnpm install
pnpm build
```

The chrome extension will be output to `build/chrome-mv3-prod` and the Firefox addon will be output to `build/firefox-mv2-prod`.