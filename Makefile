manifest-chromium:
	cp manifest_chrome.json manifest.json

manifest-firefox:
	cp manifest_firefox.json manifest.json

background-prod:
	cp background.prod.js background.js

background-dev:
	cp background.dev.js background.js

run-chromium: background-dev manifest-chromium
	web-ext run --target=chromium
	make clean

run-firefox: background-dev manifest-firefox
	web-ext run
	make clean

bundle-%:
	zip -r build_$* . -x ".git*" "build*" .DS_Store "*.map" "screenshots/*" TODO "manifest_*.json" Makefile background.dev.js background.prod.js

build-firefox: manifest-firefox bundle-firefox

build-chrome: manifest-chromium bundle-chrome

build: background-prod build-firefox build-chrome
	make clean

lint: manifest-firefox
	web-ext lint
	make clean

clean:
	rm -f manifest.json background.js

.DEFAULT_GOAL := clean
