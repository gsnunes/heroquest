#!/bin/sh

echo $WERCKER_DEPLOYTARGET_NAME

if [ "$WERCKER_DEPLOYTARGET_NAME" = "dev" ]; then
	#sed -i 's!192.168.56.101!test.hangoutsplay.com!g' app.xml
	scp -i $PRIVATEKEY_PATH assets/app.xml root@104.236.20.173:/var/www/dev.hangoutsplay.com/public_html
fi

if [ "$WERCKER_DEPLOYTARGET_NAME" = "test" ]; then
	sed -i 's!localhost:1337!test.hangoutsplay.com!g' assets/app.xml
	scp -ri $PRIVATEKEY_PATH * root@104.236.20.173:/var/www/test.hangoutsplay.com
fi