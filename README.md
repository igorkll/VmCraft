# VmCraft
## cube game with virtual machines
rather an experimental project. I wanted to work with virtual machines and 3D graphics on the web  
Nevertheless, it works and the VMs start up  
Play online: https://igorkll.github.io/VmCraft  
Download: https://github.com/igorkll/VmCraft/releases  

## chrome dev mode
### for local testing without a web server,
### you need to run chrome with special flags to disable some security checks
* windows: "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="%USERPROFILE%\ChromeDev"

## game control
* esc - release the cursor
* ~ - close/open menu
* wasd - move
* C - sit down/slow down
* shift - sprint
* f11 - fullscreen
* f3 - show debug

## robot control
the robot is controlled via the pseudo-file /dev/ttyS0  
send a command with a \n character at the end. you will receive a response from the robot in the same way with a \n character at the end  

### codes
* forward
* back
* turn_left
* turn_right
* top
* bottom

### response codes
* busy
* successfully
* failed
