#!/bin/sh

hciconfig hci0 up
/usr/local/bin/node index.js
