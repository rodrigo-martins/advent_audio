myApp.directive('bufferedScroll', function ($parse) {
    return function ($scope, element, attrs) {
        var handler = $parse(attrs.bufferedScroll);
        document.addEventListener("scroll", function(){
            var scrollTop = element[0].scrollTop,
            scrollHeight = element[0].scrollHeight,
            offsetHeight = element[0].offsetHeight;
            console.log(element)
            console.log(scrollTop, scrollHeight, offsetHeight)
            if (scrollTop === (scrollHeight - offsetHeight)) {
                $scope.$apply(function () {
                    handler($scope);
                });
            }
        });
    };
});