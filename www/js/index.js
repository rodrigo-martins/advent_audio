var myApp = angular.module('myApp', [])

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

myApp.controller('myCtrl', function ($scope) {

    //Retirar window depois que testar
    window.media = null

    $scope.status = 0
    $scope.duration = 0
    $scope.position = 0

    $scope.audio = null;

    $scope.playList = [{
            "name": 'Easy',
            "url": "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        }, {
            "name": 'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        }, {
            "name": 'Kate',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        }, {
            "name": 'Mozart',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        }
    ]

    $scope.play = function () {

        //Check is there is audio
        if (!$scope.audio) {
            if (!$scope.playList.length) return
            $scope.audio = $scope.playList[0]
        }

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
            setTimeout(function(){$scope.play()},1000)
        }

        console.log($scope.status)

        if ($scope.status == 0 || $scope.status == 4) {
            media = new Media($scope.audio.url,
                // success callback
                function () {
                    console.log("Audio Success", $scope.audio);
                },
                // error callback
                function (err) {
                    console.log("Audio Error: ", $scope.audio);
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

                    switch (e) {
                        case 0:
                            break
                        case 1:
                            break
                        case 2:

                            //Set Position
                            var clock = setInterval(function () {
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
                            var timerDur = setInterval(function () {
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
                            $scope.duration = 0
                            $scope.position = 0
                            break
                        default:

                            break
                    }

                    //Stop clock if not running
                    if (e != 2) clearTimeout(clock)

                    $scope.$apply()
                }
            );
            // Play audio
            media.play()
        }
    }

    $scope.setAudio = function (audio) {
        $scope.audio = audio
        $scope.play()
    }

    $scope.pause = function () {
        if (media) {
            media.pause()
        }
    }

    $scope.stop = function () {
        if (media) {
            media.stop()
            media.release()
        }
        $scope.audio = null
    }

    $scope.seekTo = function () {
        media.seekTo($scope.position * 1000)
    }

    $scope.nextAudio = function (){
        if($scope.audio){
            var i = $scope.playList.indexOf($scope.audio)
            if(++i < $scope.playList.length ){
                $scope.setAudio($scope.playList[i])
            }
        } 
    }    
})  
