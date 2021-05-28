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
