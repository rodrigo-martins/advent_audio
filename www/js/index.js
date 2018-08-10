var myApp = angular.module('myApp', ['ngMaterial', 'ngMessages'])

myApp.filter('secondsToTime', function() {

    function padTime(t) {
        return t < 10 ? "0"+t : t;
    }

    return function(_seconds) {
        if (typeof _seconds !== "number" || _seconds <= 0)
            return "00:00";
        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60),
            seconds = Math.floor(_seconds % 60);

        if(hours<0)    
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

    $scope.audioList = [{
            "name":'Easy',
            "url":"http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3"
        },{
            "name":'Cold Play',
            "url": "https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/speed-of-sound-128.mp3",
        },{
            "name":'Kate',
            "url":"https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/dark-horse-320.mp3"
        },{
            "name":'Mozart',
            "url":"https://ondemand.npr.org/anon.npr-mp3/npr/quiz/2015/06/mozart-17-128.mp3"
        }
    ]

    $scope.play = function () {

        if(!$scope.audio.url){
            if(!$scope.audioList.length) return
            $scope.audio = $scope.audioList[0]
        }

        //if paused
        if($scope.status == 3 && media.src == $scope.url){
            media.play()
            return;
        }

        //if another audio
        if( media && media.src != $scope.url){
            media.stop()
            media.release()
        }

        if($scope.status == 0 || $scope.status == 4){
            // Play the audio file at url
            console.log($scope.url)
            media = new Media($scope.url,
                // success callback
                function() {
                    console.log("play("+$scope.url+"):Audio Success");
                },
                // error callback
                function(err) {
                    console.log("play("+$scope.url+"):Audio Error: ",err);
                },
                function(e){
                    $scope.status = e
                    $scope.duration = media.getDuration()

                    if(e == 2){
                        var clock = setInterval(function(){
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
    
                        },1000)

                        var counter = 0;
                        var timerDur = setInterval(function() {
                            counter += + 100;
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

                    }else{
                        clearTimeout(clock)
                    }

                    if(e == 4){
                        $scope.duration = 0
                        $scope.position = 0
                    }

                    $scope.$apply()
                }
            );
            // Play audio
            media.play()
            console.log(media)
        }
    }

    $scope.setAudio = function (audio){
        $scope.audio = audio
        $scope.play()
    }

    $scope.pause = function (){
        if(media){
            media.pause()
        }
    }

    $scope.stop = function (){
        if(media){
            media.stop()
            media.release()
        }
    }

    $scope.seekTo = function(){
        media.seekTo($scope.position * 1000)
    }
})
