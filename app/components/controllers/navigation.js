/**
 * Created by Администратор on 25.02.2017.
 */
;
(function () {
    "use strict";

    angular
        .module("app.navigation", ["ui.router"])
        .controller("NavigationController", navigationController);

    navigationController.$inject = [
        "$log",
        "$state",
        //"$stateParams",
        "auth",
        "shop"
    ];

    function navigationController(
        $log,
        $state,
        //$stateParams,
        auth,
        shop
    ) {
        const self = this;
        self.ctrl = "navigationController";
        $log.debug(`INIT CONTROLLER > ${self.ctrl} >`);

        self.app = {
            "title": "Testing AngularJS App",
            "description": "Internet shopping web application",
            "keywords": "Angular, SPA, Material Design"
        };

        // User info for navigation panel
        self.user = auth.user;

        // Shop cart info for popup menu
        self.cart = shop.cart;

        // Navigation methods
        self.signup = signup;
        self.login =  login;
        self.logout = logout;
        self.search = search;
        //self.toCart = toCart;

        // Renew state for current page
        //self.reloadPage = reloadPage;

        // FUNCTIONS

        function signup() { $state.go("signup", {}); }

        function login() { $state.go("login", {}); }

        function logout() { auth.logout(); }

        function search() { $state.go("search", {}); }

        //function toCart() { }

        //function reloadPage() {
        //    $state.transitionTo($state.current, $stateParams, {
        //        reload: true, inherit: false, notify: true
        //    });
        //}
    };
})();