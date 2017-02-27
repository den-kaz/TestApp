;
(function () {
    "use strict";

    angular
        .module("app.login", ["ui.router"])
        .config(config)
        .controller("LoginController", loginController);

    loginController.$inject = [
        "$log",
        "$state",
        "auth"
    ];

    function loginController(
        $log,
        $state,
        auth
    ) {
        const self = this;
        self.ctrl = "loginController";
        $log.debug(`INIT CONTROLLER > ${self.ctrl} >`);

        self.message =     "";
        self.credentials = auth.credentials;
        self.login =       login;

        // FUNCTIONS

        function login() {
            auth.login().then(
                function (message) { message ? self.message = message : $state.go("search"); },
                function (message) { self.message = message; });
        }
    }

    config.$inject = ["$stateProvider"];

    function config( $stateProvider ){
        $stateProvider.state( "login", {
            "url" :         "/login",
            "templateUrl":  "login/login.html",
            "controller":   "LoginController",
            "controllerAs": "ctrl"
        })
    }
})();