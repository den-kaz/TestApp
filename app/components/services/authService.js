;
(function () {
    "use strict";

    angular
        .module("app.authService", [])
        .factory("auth", authService);

    authService.$inject = ["$q", "$log", "localStorageService", "hash"];

    function authService($q, $log, localStorageService, hash) {
        const self = this;

        self.user = newUser();
        self.registration = newRegistartion();
        self.credentials = newCredentials();

        self.public = {
            // Variables
            user: self.user,
            registration: self.registration,
            credentials: self.credentials,
            // Functions
            signup: signup,
            login: login
        };

        return self.public;

        // FUNCTIONS

        function signup() {
            const deferred = $q.defer();
            const params = newHashParams(self.registration.password);

            hash.pbkdf2(params).then(
                function (hash) { deferred.resolve(addUser(self.registration.email, hash)); },
                function (message) { deferred.reject(message); });

            return deferred.promise;
        }

        function login() {
            const deferred = $q.defer();
            const params = newHashParams(self.credentials.password);

            hash.pbkdf2(params).then(
                function (hash) { deferred.resolve(checkUser(self.credentials.email, hash)); },
                function (message) { deferred.reject(message); });

            return deferred.promise;
        }

        function addUser(name, hash) {
            // Cleaning current user credentials
            setUser("", "", false);

            // Load users array or create new
            const users = localStorageService.get("users") || [];

            // For new user will be "id = -1", for exist user name "id > -1"
            const id = indexByKey(users, "name", name);

            // New user, else already exist!
            if (id === -1) {
                // Create new account
                const account = newAccount(users.length, name, hash);

                // Add new user to account directory and save
                users.push(account);
                localStorageService.set("users", users);

                // Set new user credentials
                setUser(name, hash, true);

                // Cleaning sign up fields
                setRegistration("", "", "");
            }

            return self.user.isAuth;
        }

        function checkUser(name, hash) {
            // Load users array or create new
            const users = localStorageService.get("users");
            if (!users) return "Directory is empty";

            // Found account by user name
            const id = indexByKey(users, "name", name);
            if (id === -1) return "Account not found";
            if (users[id].hash !== hash) return "Password is wrong";

            // Set current user credentials
            setUser(name, hash, true);

            return "";
        }

        function setUser(name, hash, isAuth) {
            self.user.name = name;
            self.user.hash = hash;
            self.user.isAuth = isAuth;
        }

        function setRegistration(email, password, confirmPassword) {
            self.registration.email = email;
            self.registration.password = password;
            self.registration.confirmPassword = confirmPassword
        }

        // HELPERS

        function indexByKey(arr, key, value) {
            let id = -1;
            for (let i = 0, len = arr.length; i < len; i++)
                if (value === arr[i][key]) {
                    id = i;
                    break;
                }

            return id;
        }

        // FABRICS

        function newUser() {
            return {
                "name": "User",
                "hash": "",
                "isAuth": true
            };
        }

        function newRegistartion() {
            return {
                "email": "",
                "password": "",
                "confirmPassword": ""
            };
        }

        function newCredentials() {
            return {
                "email": "",
                "password": ""
            }
        }

        function newAccount(id, name, hash) {
            return {
                "id": id,
                "name": name,
                "hash": hash
            }
        }

        function newHashParams(password) {
            return {
                "salt": "Pick anything you want. This isn't secret.",
                "iterations": 1000,
                "hash": "SHA-512",
                "password": password
            };
        }
    }
})();