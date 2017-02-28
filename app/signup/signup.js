;
(function () {
    "use strict";

    angular
        .module("app.signup", ["ui.router"])
        .config(config)
        .controller("SignupController", signupController);

    signupController.$inject = [
        "$log",
        "$state",
        "auth"
    ];

    function signupController(
        $log,
        $state,
        auth
    ) {
        const self = this;
        self.ctrl = "signupController";
        $log.debug(`INIT CONTROLLER > ${self.ctrl} >`);

        self.message =      "";
        self.registration = auth.registration;
        self.signup =       signup;

        // FUNCTIONS

        function signup() {
            auth.signup().then(
                function (isSigned) {
                    isSigned
                        ? $state.go("search")
                        : self.message = "User already exist!";
                },
                function (message) {
                    self.message = message;
                });
        }
    }

    config.$inject = ["$stateProvider"];

    function config( $stateProvider ){
        $stateProvider.state( "signup", {
            "url" :         "/signup",
            "templateUrl":  "signup/signup.html",
            "controller":   "SignupController",
            "controllerAs": "ctrl",
            "authLevel":    0
        })
    }
})();