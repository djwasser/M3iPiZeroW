#!/bin/sh

hciconfig hci0 up
hciconfig hci1 up
/usr/local/bin/node index.js
