@echo off

REM ------------------------ publish on github pages
set GITHUB_PAGES_PATH=..\igorkll.github.io\VmCraft
if exist "%GITHUB_PAGES_PATH%" rmdir /s /q "%GITHUB_PAGES_PATH%"
xcopy /E /I /H /R /Y VmCraft "%GITHUB_PAGES_PATH%"

REM ------------------------ build native builds
set BUILD_DIR=build
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
mkdir "%BUILD_DIR%"