#!/bin/sh

echo $WERCKER_DEPLOYTARGET_NAME

if [ "$WERCKER_DEPLOYTARGET_NAME" = "dev" ]; then
	sed "s/192.168.56.101/test/g" app.xml
	scp -i $PRIVATEKEY_PATH app.xml root@104.236.20.173:/var/www/dev.hangoutsplay.com/public_html
fi