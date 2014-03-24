Ti.UI.setBackgroundColor('#000');

var installrUpdater = require('installrUpdater');

// Get your App Token from installr - on the settings tab of any app
var installrAppToken = "DhhfQUJBfQY7fsI7TYKQqqQB2tNL";

// This will automatically check for an update check for an update
// on app resume and the app going online
installrUpdater.autocheck(installrAppToken);

var window1 = Ti.UI.createWindow({
	backgroundColor : 'white',
	exitOnClose : true
});

var label = Ti.UI.createLabel({
	text : "This will be the contents of Your Cool App",
	textAlign : 'center',
	font : {
		fontSize : 24,
		color : '#EEE'
	}
});

label.addEventListener('click', function() {

	// An example of passing your own function to handle the response
	installrUpdater.checkForNewerVersion(installrAppToken, function(e) {
		alert('this is my custom handler for the data');
		Ti.API.info(e, null, 4);
	});
});

window1.add(label);

window1.open();
