# M3iPiZeroW 
This repo is my (finally!) successful attempt to set up a headless PI Zero W with no additional dongles that can continuously scan the proprietary M3i broadcasts and implement the BLE services for:
* Cycling Power (including cadence info)
* Cycling Speed and Cadence (only cadence info)
* Fitness Machine (power, instantaneous cadence, heart rate)
* Heart Rate

I blatantly appropriated some of the work other folks are doing (see [hypermoose/Keiser2Zwift](https://github.com/hypermoose/Keiser2Zwift) and [ptx2/gymnasticon](https://github.com/ptx2/gymnasticon)) and was able to implement all of the BLE services using only the single on-board PIZeroW bluetooth adapter. 

What is currently working:
* Fitness Machine Service (FTMS) with power, instantaneous cadence, and heart rate
  * all three successfully demonstrated to work with Kinomap on ipad
  * power and cadence work with Zwift on iPad; no HR
* Heart Rate Service / note: functions correctly but commented out.  See note on Peloton below.  
  * Works with Zwift on iPad; so combined with FTMS all three measurements available
  * Works with Peloton on iPad.  Functions fine with HR Strap that talks to M3i.  With no HR stap, Peloton seems to see random "ghost" heart rate values. So commented out for now as I typically use a Wahoo TICKR that does not talk to M3i.  
* Cycling Power Service (including cadence)
* Cycling Speed and Cadence Service (cadence only)
  * Once this service was implemented, cadence was found by Peloton running on the iPad

Note that for the Cycling Power Service and for the Cycling Speed and Cadence service, the cadence information (crank count and timestamp) is calculated from the instantaneous rpms reported by the Keiser M3i.

Installation of software roughly follows the steps used by [hypermoose/Keiser2Zwift](https://github.com/hypermoose/Keiser2Zwift).  When I get some time I will post some detailed intructions here starting from scratch.

I side benefit is the the PIZeroW without the dongle runs fine on the power from the USB port on the back of my HDTV.  So I just have the PIZeroW velcroed to the back of the TV and powered by a short USB power cable which gives me nice clean "invisible" install.

# Installation

These installation steps are based on starting with a Raspberry PI Zero W, a blank miniSD card, and a laptop running Windows 10.

1. Install the latest 32-bit Raspbian PI OS Lite image on the miniSD card.  I used the Raspberry Pi Imager v1.6.2 running on a Windows 10 laptop.  Once the image in written, the Imager automatically ejects the miniSD card.  I physically removed the miniSD card, reinserted it into the laptop, then went to Step 2.
2. Pre-setup for headless operation and to enable SSH connection:
    * To configure for headless WiFi connection, create a text file named wpa_supplicant.conf and place it in the root directory of the miniSD card.  Add the folowing text to the file:
        ```
        country=US
        ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
        update_config=1
        
        network={
           scan_ssid=1
           ssid="your_wifi_ssid"
           psk="your_wifi_password"
        }
        ```
    * To automaticllay enable SSH (Secure Socket Shell) connection to the Rapberry PI, create an empty file "ssh" (no file extenstion)in the root directory of the miniSD card.
3. Eject the miniSD card, insert it into the Raspberry Pi Zero W, and power the Pi Zero up.  If all goes well, the Pi Zero will show up on your network.  You may need to use your router tools to determine the IP address assigned to the Pi Zero W.
4. Once the Pi Zero W is up and running on your WiFi network, connect via SSH using the IP address noted in the previous step and log in using the pi account (default passwprd "raspberry"). At that point I executed the following two commands (the upgrade command may take awhile to complete):
     ```
     pi@raspberrypi:~ $ sudo apt-get update
     pi@raspberrypi:~ $ sudo apt-get upgrade
     ```
5. Disable the default bluetooth service and move the file to a backup location to make sure it does not come back on rebot:
    ```
    sudo systemctl stop bluetooth
    sudo systemctl disable bluetooth
    sudo mv /usr/lib/bluetooth/bluetoothd bluetoothd.bak
    ```
6. Install the bluetooth development requirements:
    ```
    sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
    ```
7. Install NVVM to manage Node.js versions:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
    ```
8. At this point, I rebooted the Raspberry pi and started a fresh SSH session:
    ```
    sudo shutdown -r now
    ```
9.  Install a binary build of Node.js that supports Pis (I just used version 10.22.0 as I know it works).  After install I copied all the files to a directory that sudo looks for:
    ```
    nvm install 10.22.0
    sudo cp -r /home/pi/.nvm/versions/node/v10.22.0/* /usr/local/
    ```
10. Install git, create directory /home/pi/code, make this the working directory and clone this repository:
     ```
     sudo apt update
     sudo apt install git
     mkdir /home/pi/code
     cd /home/pi/code
     git clone https://github.com/djwasser/M3iPiZeroW.git
     ```

