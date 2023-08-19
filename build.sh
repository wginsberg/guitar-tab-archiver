#!/bin/bash

exclude_patterns=( ".git*" ".DS_Store" "build.sh" "screenshots/" "TODO" )

zip -r build . -x "${exclude_patterns[@]}"

