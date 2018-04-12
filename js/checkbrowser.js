var Browser = {
    Version: function() {
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") != -1)
        // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
}

if (Browser.Version() < 8) {
    var message = " \n" +
                  "   You are using Internet Explorer 7.0 or an old web browser! \n\n" +
                  "   This website is best displayed in these browsers: \n" +
                  "          - Internet Explorer 8.0 or later.\n" +
                  "          - Mozilla Firefox  4.0 or later. \n" +
                  "          - Google Chrome 10.x or later. \n" +
				  "          - Apple Safari 4 or later. \n" +
                  "          - Opera 9 or later. \n\n" +
                  "   DO YOU WANT TO GO TO WEB BROWSERS DOWNLOAD PAGE? \n" +
                  "     [OK] - Yes, I do.\n" +
                  "     [Cancel] - No, I don't.\n";
    var confirmed = confirm(message);
    if (confirmed)
        window.location = "/DownloadWebBrowsers.htm";
}