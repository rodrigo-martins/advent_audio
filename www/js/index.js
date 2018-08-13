var myApp = angular.module('myApp', ['ngMaterial'])

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

var global = 'global'
window.globalWindow = 'globalWindow'

myApp.controller('myCtrl', function ($scope, $mdBottomSheet) {

    //Retirar window depois que testar
    window.media = null
    var clock = null
    var timerDur = null

    $scope.status = 0
    $scope.duration = 0
    $scope.position = 0

    $scope.audio = null;

    $scope.book = {
        name: "History of Sabbath",
        image: "https://cdn7.bigcommerce.com/s-58mm4kv8p/images/stencil/1000x1000/products/1161/1281/History-of-the-Sabbath__94748.1506607626.jpg?c=2"
    } 
   

    $scope.playList = [
        {
            "name": 'Guitar',
            "url": "http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        },
        {
            "name": 'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        },
        {
            "name": 'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        },
        {
            "name": 'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        },
        {
            "name": 'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        },
    ]


    if (!$scope.audio && $scope.status == 0) {
        if (!$scope.playList.length) return
        $scope.audio = $scope.playList[0]
    }

    $scope.playAudio = function () {

        //Audio Paused
        if ($scope.status == 3 && media.src == $scope.audio.url) {
            media.play()
            return
        }

        //Another audio
        if (media && media.src != $scope.audio.url) {
            media.stop()
            media.release()

            //Wait a second to callback of stop function change the $scope.state value
            setTimeout(function () { $scope.playAudio() }, 1000)
        }

        if ($scope.status == 0 || $scope.status == 4) {
            media = new Media($scope.audio.url,
                // success callback
                function (e) {
                    console.log("Audio Success", e, $scope.audio);
                },
                // error callback
                function (err) {
                    media.stop()
                    media.release
                    media = null
                    $scope.audio = null
                    $scope.status = 0
                    $scope.apply()
                    console.log("Audio Error: ", err, $scope.audio);
                },
                function (e) {
                    /* 
                    Media.MEDIA_NONE = 0;
                    Media.MEDIA_STARTING = 1;
                    Media.MEDIA_RUNNING = 2;
                    Media.MEDIA_PAUSED = 3;
                    Media.MEDIA_STOPPED = 4;
                    */

                    $scope.status = e

                    //Stop clock if not running
                    if (e != 2) clearTimeout(clock)

                    switch (e) {
                        case 0:
                            break
                        case 1:
                            break
                        case 2:

                            //Set Position
                            clock = setInterval(function () {
                                media.getCurrentPosition(
                                    // success callback
                                    function (position) {
                                        if (position > -1) {
                                            $scope.position = position
                                            $scope.$apply()
                                        }
                                    },
                                    // error callback
                                    function (e) {
                                        console.log("Error getting pos=" + e);
                                    }
                                )

                            }, 1000)

                            //Set Duration
                            var counter = 0;
                            timerDur = setInterval(function () {
                                counter += 100;
                                if (counter > 2000) {
                                    clearInterval(timerDur);
                                }
                                var duration = media.getDuration();
                                if (duration > 0) {
                                    clearInterval(timerDur);
                                    $scope.duration = duration
                                    $scope.$apply()
                                }
                            }, 100);

                            break
                        case 3:
                            break
                        case 4:
                            media = null
                            $scope.duration = 0
                            $scope.position = 0
                            $scope.apply()
                            break
                        default:
                            break
                    }

                    $scope.$apply()
                }
            );
            // Play audio
            media.play()
        }
    }

    $scope.setAudio = function (audio) {
        $scope.audio = audio
        $scope.playAudio()
    }

    $scope.pauseAudio = function () {
        if (media) {
            media.pause()
            clearTimeout(clock)
        }
    }

    $scope.stopAudio = function () {
        if (media) {
            media.stop()
            media.release()
            clearTimeout(clock)
        }
    }

    $scope.seekToAudio = function () {
        media.seekTo($scope.position * 1000)
    }

    $scope.nextAudio = function () {
        if ($scope.audio) {
            var i = $scope.playList.indexOf($scope.audio)
            if (++i < $scope.playList.length) {
                $scope.setAudio($scope.playList[i])
            }
        }
    }

    $scope.previousAudio = function () {
        if ($scope.audio) {
            var i = $scope.playList.indexOf($scope.audio)
            if (--i >= 0) {
                $scope.setAudio($scope.playList[i])
            }
        }
    }

    $scope.showGridBottomSheet = function () {
        $scope.alert = ''
        $mdBottomSheet.show({
            templateUrl: 'player.html',
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
        }).then(function (e) {

        }).catch(function (e) {
            // User clicked outside or hit escape
        })
    }
})
