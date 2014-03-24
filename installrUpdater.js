const URL_ENDPOINT = "https://www.installrapp.com/apps/status/";

// Last time we prompted them
var lastCheck = 0;

var defaultHandler = function(response) {

	var now = new Date();
	var secondsSinceLastCheck = Math.floor((now - lastCheck) / 1000);

	if (secondsSinceLastCheck < (60 * 10)) {
		// Don't prompt the user more than once every ten minutes
		Ti.API.info('it has only been ' + secondsSinceLastCheck + ' seconds since we last prompted the user, skipping this time');
		return;
	}

	// Get the current version number
	var currentVersion = Ti.App.version + ".0.0.0";

	var currentVersionParts = currentVersion.split('.');

	var installrVersionParts = response.versionNumber.split('.');

	var isSame = true;

	for (var i = 0; i < currentVersionParts.length; i++) {
		var currentStep = currentVersionParts[i];
		var installrStep = "0";
		if (installrVersionParts[i]) {
			installrStep = installrVersionParts[i];
		}
		if (currentStep != installrStep) {
			isSame = false;
		}
	}

	if (!isSame) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'No'],
			message : 'A new version of the ' + response.title + " app is available. Would you like to download the new version now?",
			title : 'Upgrade Available'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				return;
			} else {
				Ti.Platform.openURL(response.installUrl);
			}
		});
		dialog.show();
		lastCheck = new Date();
	} else {
		Ti.API.info("Installr Updater: version on installr is the same as local version: " + currentVersion + "=" + response.versionNumber);
	}

};

var checkForNewerVersion = function(appId, _success) {

	if (Ti.App.deployType == 'production') {
		Ti.API.info("Installr Updater: will not check for updates in production deployType");
		return;
	}

	if (appId == "") {
		Ti.API.error("Installr Updater: appId required");
		return;
	}

	if (!Ti.Network.online) {
		Ti.API.info("Installr Updater: App is not online, not checking for new version");
		return;
	}

	// hit API on installr to see the data
	var http = Ti.Network.createHTTPClient();
	http.open("GET", URL_ENDPOINT + appId + ".json");
	http.onload = function() {
		var responseJSON = JSON.parse(http.responseText);
		if (responseJSON.result == "success") {
			if (_success) {
				_success(responseJSON.appData);
			} else {
				defaultHandler(responseJSON.appData);
			}
		} else {
			Ti.API.error(responseJSON.message);
		}
	};
	http.onerror = function() {
		Ti.API.error(http.statusText);
	};
	http.send();
};

var autocheck = function(theAppId) {

	// run this on resume and network back online
	Ti.App.addEventListener('resume', function() {
		checkForNewerVersion(theAppId);
	});

	Ti.Network.addEventListener('change', function(e) {
		if (e.online) {
			checkForNewerVersion(theAppId);
		}
	});

	checkForNewerVersion(theAppId);

};

exports.autocheck = autocheck;
exports.checkForNewerVersion = checkForNewerVersion;
