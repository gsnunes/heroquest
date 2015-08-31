#!/bin/sh

echo $WERCKER_DEPLOYTARGET_NAME

if [ "$WERCKER_DEPLOYTARGET_NAME" = "dev" ]; then
	sed -i 's!<!-- main-script -->!<script data-main="//localhost:1337/js/src/config" src="//localhost:1337/bower_components/requirejs/require.js" id="main-script"></script>!g' assets/app.xml
	scp -i $PRIVATEKEY_PATH assets/app.xml root@104.236.20.173:/var/www/dev.hangoutsplay.com/public_html
fi

if [ "$WERCKER_DEPLOYTARGET_NAME" = "test" ]; then
	sed -i 's!localhost:1337!test.hangoutsplay.com!g' assets/app.xml
	sed -i 's!<!-- main-script -->!<script src="//localhost:1337/js/src/main-built.js" id="main-script"></script>!g' assets/app.xml
	scp -ri $PRIVATEKEY_PATH * root@104.236.20.173:/var/www/test.hangoutsplay.com
fi