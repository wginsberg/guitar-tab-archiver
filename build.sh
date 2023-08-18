#!/bin/bash

exclude_patterns=( ".DS_Store" "build.sh" "screenshots/" "TODO" )

zip -r build . -x "${exclude_patterns[@]}"

