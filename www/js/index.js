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

    var media = null

    $scope.status = 0
    $scope.duration = 0
    $scope.position = 0


    $scope.playAudio = function (url) {

        //if paused
        if($scope.status == 3 && media.src == url){
            media.play()
            return;
        }

        //if another audio
        if( media && media.src != url){
            media.stop()
            media.release()
        }

        if($scope.status == 0 || $scope.status == 4){
            // Play the audio file at url
            media = new Media(url,
                // success callback
                function() {
                    console.log("playAudio():Audio Success");
                },
                // error callback
                function(err) {
                    console.log("playAudio():Audio Error: ",err);
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

    $scope.pause = function (){
        if(media){
            media.pause()
        }
    }

    $scope.stop = function (){
        if(media){
            media.stop()
        }
    }

    $scope.seekTo = function(){
        media.seekTo()
    }
})
