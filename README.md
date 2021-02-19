# M3iPiZeroW
At this pont this repo is to dabble in translating Keiser M3i broadcasts into Bluetooth smart services useful for  use with training software.  Other folks are doing this (see [hypermoose/Keiser2Zwift](https://github.com/hypermoose/Keiser2Zwift) and [ptx2/gymnasticon](https://github.com/ptx2/gymnasticon)) but they both just implement part of the solution I want. My plan is to blatently approriate these projects as a starting point with the goal of setting up a headless PI Zero W with no additional dongles that can continuously scan the proprietry M3i braodcasts and implement the BLE services for:
* Cycling Power (including cadence info)
* Cycling Speed and Cadence (only cadence info)
* Fitness Machine (power, instantaneous cadence, heart rate)
* Heart Rate

My hope is that this will enable the broadest range of training software to access the full information provided by the M3i (power, rpm, heart rate).  It will also simulate cadence (stroke count and timestamp) for client software that does not utilize the Fitness Machine service.

I'll be learning how to use github and node.js at that same time, so likely will be a bit muddled for awhile!

