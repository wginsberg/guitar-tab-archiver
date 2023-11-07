manifest-chromium:
	cp manifest_chrome.json manifest.json

manifest-firefox:
	cp manifest_firefox.json manifest.json

seed-prod:
	cp seed.prod.js seed.js

seed-dev:
	cp seed.dev.js seed.js

run-chromium: seed-dev manifest-chromium
	web-ext run --target=chromium
	make clean

run-firefox: seed-dev manifest-firefox
	web-ext run
	make clean

run-android-firefox: seed-dev manifest-firefox
	DEVICE=$(shell adb devices | tail -n+2 | head -n1 | cut -f1); \
	[ -n "$$DEVICE" ] && \
	web-ext run -t firefox-android --firefox-apk=org.mozilla.firefox_beta --adb-device="$$DEVICE"
	make clean

bundle-%:
	zip -r build_$* . -x ".git*" "build*" .DS_Store "*.map" "screenshots/*" TODO "manifest_*.json" Makefile background.dev.js background.prod.js

build-firefox: manifest-firefox bundle-firefox

build-chrome: manifest-chromium bundle-chrome

build: seed-prod build-firefox build-chrome
	make clean

lint: manifest-firefox
	web-ext lint
	make clean

clean:
	rm -f manifest.json seed.js

.DEFAULT_GOAL := clean
