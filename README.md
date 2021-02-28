# M3iPiZeroW
This repo is to dabble in translating Keiser M3i broadcasts into Bluetooth smart services useful for  use with training software.  Other folks are doing this (see [hypermoose/Keiser2Zwift](https://github.com/hypermoose/Keiser2Zwift) and [ptx2/gymnasticon](https://github.com/ptx2/gymnasticon)) but they both just implement part of the solution I want. My plan is to blatently approriate these projects as a starting point with the goal of setting up a headless PI Zero W with no additional dongles that can continuously scan the proprietary M3i broadcasts and implement the BLE services for:
* Cycling Power (including cadence info)
* Cycling Speed and Cadence (only cadence info)
* Fitness Machine (power, instantaneous cadence, heart rate)
* Heart Rate

My hope is that this will enable the broadest range of training software to access the full information provided by the M3i (power, rpm, heart rate).  It will also simulate cadence (stroke count and timestamp) for client software that does not utilize the Fitness Machine service.

I'll be learning how to use github and node.js at that same time, so likely will be a bit muddled for awhile!

What is currently working:
* Fitness Machine Service (FTMS) with power, instantaneous cadence, and heart rate
  * all three successfully demonstrated to work with Kinomap on ipad
  * power and cadence work with Zwift on iPad; no HR
* Heart Rate Service
  * Works with Zwift on iPad; so combined with FTMS all three measurements available
  * Works with Peloton on iPad
* Cycling Power Service (including cadence)
* Cycling Speed and Cadence Service (cadence only)
  * Once this service was implemented, cadence was found by Peloton running on the iPad

Note that for the Cycling Power Service and for the Cycling Speed and Cadence service, the cadence information (crank count and timestamp) is calculated from the instantaneous rpms reported by the Keiser M3i.

At this point, still using two bluetooth adapters: the one built into the Pi Zero W and a USB dongle.
