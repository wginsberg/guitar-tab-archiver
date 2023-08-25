#!/bin/bash

exclude_patterns=( ".git*" ".DS_Store" "*.sh" "build.zip" "build/*" "*.map" "screenshots/*" "TODO" )

zip -r build . -x "${exclude_patterns[@]}"
