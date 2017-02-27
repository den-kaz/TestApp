;
(function (angular){
"use strict";
    angular
        .module("app", [
            // External modules
            "angularMoment",
            "LocalStorageModule",
            "ngMaterial",
            "ngMessages",
            "ngMdIcons",
            "ui.router",

            // Controllers
            "app.navigation",
            "app.signup",
            "app.login",
            "app.search",

            // Services
            "app.authService",
            "app.hashService",
            "app.shopService",

            // Directives
            "app.starRating"
        ])
        .config(appConfig)
        .run(runBlock);

    runBlock.$inject = [
        //"$q",
        "$log",
        "$rootScope",
        "$state",
        "$stateParams"
    ];

    function runBlock(
        //$q,
        $log,
        $rootScope,
        $state,
        $stateParams
    ){
        $log.info("  <<<  Hey! AngularJS application now running ...  >>>   ");

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // authService.loadUserCredentials();
    };

    appConfig.$inject = [
        //"$stateProvider",
        "$urlRouterProvider",
        //"$locationProvider",
        "$logProvider",
        "$mdDateLocaleProvider",
        "$mdIconProvider",
        "$mdThemingProvider",
        //"$httpProvider",
        "moment"
    ];

    function appConfig(
        //$stateProvider,
        $urlRouterProvider,
        //$locationProvider,
        $logProvider,
        $mdDateLocaleProvider,
        $mdIconProvider,
        $mdThemingProvider,
        //$httpProvider,
        moment
    ) {
        //$locationProvider.html5Mode(true).hashPrefix("!");

        // For any unmatched url, send to /home
        $urlRouterProvider.otherwise("/search");

        // logProvider - "true" for working $log.debug() in AngularJS code (write to console)
        $logProvider.debugEnabled(true);

        // Authentification Interceptor
        //$httpProvider.interceptors.push("authInterceptorService");

        $mdDateLocaleProvider.firstDayOfWeek = 0;

        moment.locale("en");
        moment().format("l");

        $mdDateLocaleProvider.parseDate = function (dateString) {
            const m = moment(dateString, "l", true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };

        $mdDateLocaleProvider.formatDate = function (date) {
            const m = moment(date);
            return m.isValid() ? m.format("l") : "";
        };

        $mdThemingProvider.theme("default")
            .primaryPalette("light-blue", {
                "default": "800"
            })
            .accentPalette("blue-grey", {
                "default": "400"
            });
        //.dark();

        $mdIconProvider.icon("clear", "components/icons/ic_clear_24px.svg", 24);
        $mdIconProvider.icon("email", "components/icons/ic_email_24px.svg", 24);
        $mdIconProvider.icon("vpn_key", "components/icons/ic_vpn_key_24px.svg", 24);
        $mdIconProvider.icon("star", "components/icons/ic_star_24px.svg", 24);
        $mdIconProvider.icon("star_border", "components/icons/ic_star_border_24px.svg", 24);
        //$mdIconProvider.icon("star_half", "components/icons/ic_star_half_24px.svg", 24);
    };
})(angular);