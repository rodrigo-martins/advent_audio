myApp.filter('secondsToTime', function () {

    function padTime(t) {
        return t < 10 ? "0" + t : t;
    }

    return function (_seconds) {
        if (typeof _seconds !== "number" || _seconds <= 0)
            return "00:00";
        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60),
            seconds = Math.floor(_seconds % 60);

        if (hours < 0)
            return padTime(hours) + ":" + padTime(minutes) + ":" + padTime(seconds);
        else
            return padTime(minutes) + ":" + padTime(seconds);
    };
});
