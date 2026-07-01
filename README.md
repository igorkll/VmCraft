# VmCraft
## cube game with virtual machines
rather an experimental project. I wanted to work with virtual machines and 3D graphics on the web  
Nevertheless, it works and the VMs start up  

## robot control
the robot is controlled via the pseudo-file /dev/ttyS0  
you can write the command's character code there and receive a response  
each command is one character, and the return of each command is one character  

### codes
* w - forward
* s - back
* a - turn left
* d - turn right
* r - top
* f - bottom

### response codes
* B - robot is busy

