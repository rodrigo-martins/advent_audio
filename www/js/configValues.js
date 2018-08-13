myApp.constant('config', {
    apiUrl: 'https://bookreader.visie.com.br/',
    baseUrl: '/',
    enableDebug: true
});

myApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/bookStore.html"
        })
        .when("/playList", {
            templateUrl: "views/playList.html"
        })
        .when("/config", {
            templateUrl: "views/config.html"
        })
        .when("/search", {
            templateUrl: "views/search.html"
        })
        .when("/bookStoreFilter", {
            templateUrl: "views/bookStoreFilter.html"
        })
})

myApp.config(function ($mdThemingProvider, $mdColorPalette) {

    var mdColorPalette = Object.keys($mdColorPalette)
    mdColorPalette.forEach(function (el) {
        $mdThemingProvider.theme(el, 'default').primaryPalette(el)
        $mdThemingProvider.theme('dark-' + el, 'default').primaryPalette(el).dark()
    })
});