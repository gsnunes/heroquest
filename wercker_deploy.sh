#!/bin/sh

if [ "$WERCKER_DEPLOYTARGET_NAME" = "dev" ]; then
	scp -i $PRIVATEKEY_PATH app.xml root@104.236.20.173:/var/www/dev.hangoutsplay.com/public_html
fi