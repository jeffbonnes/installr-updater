# installr updater
An easy way to prompt your beta testers to update to a new build when there is a new version on installrapp.com

If you use [Installr](http://www.installrapp.com) to distribute the betas of your Titanium apps (and you should!) this is an easy way to ensure they upgrade to a new version once you upload it to installr.

Usage:

```
var installrUpdater = require('installrUpdater');

// Get your App Token from installr - on the settings tab of any app
var installrAppToken = "DhhfQUJBfQY7fsI7TYKQqqQB2tNL";

// This will automatically check for an update check for an update
// on app resume and the app going online
installrUpdater.autocheck(installrAppToken);
```

The tester will recieve a prompt if there is a new version on installr:
![prompt](https://dl.dropboxusercontent.com/u/843217/installr/upgrade.png)

You can also pass your own function to handle the response:

```
// An example of passing your own function to handle the response
	installrUpdater.checkForNewerVersion(installrAppToken, function(e) {
		alert('this is my custom handler for the data');
		Ti.API.info(e, null, 4);
	});
```

Logging:

```
[INFO] [iphone, 7.1, 192.168.1.9] {
    "title": "TestApp",
    "appId": "com.gameshape.installr.test01",
    "versionNumber": "3.0.0.1390972175177",
    "releaseNotes": "Test Again",
    "installUrl": "https://www.installrapp.com/tester/install/44"
}

```
