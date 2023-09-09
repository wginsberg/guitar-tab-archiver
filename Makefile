manifest-chromium:
	cp manifest_chrome.json manifest.json

manifest-firefox:
	cp manifest_firefox.json manifest.json

run-chromium: manifest-chromium
	web-ext run --target=chromium
	make clean

run-firefox: manifest-firefox
	web-ext run
	make clean

bundle-%:
	zip -r build_$* . -x ".git*" "build/*" .DS_Store build_*.zip "build/*" *.map "screenshots/*" TODO "manifest_*.json" Makefile

build-firefox: manifest-firefox bundle-firefox

build-chrome: manifest-chromium bundle-chrome

build: build-firefox build-chrome
	make clean

lint: manifest-firefox
	web-ext lint
	make clean

clean:
	rm -f manifest.json

.DEFAULT_GOAL := clean
