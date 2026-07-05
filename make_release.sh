#!/bin/bash

# ------------------------ publish on github pages
GITHUB_PAGES_PATH="../igorkll.github.io/VmCraft"
rm -rf "$GITHUB_PAGES_PATH"
cp -a VmCraft "$GITHUB_PAGES_PATH"

# ------------------------ build native builds
BUILD_DIR="build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
