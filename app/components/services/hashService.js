;
(function () {
    "use strict";

    angular
        .module("app.hashService", [])
        .factory("hash", hashService);

    hashService.$inject = ["$q"];

    function hashService($q) {
        const self = this;

        // ###################################################### RETURN
        self.public = {
            "pbkdf2": pbkdf2
        };

        return self.public;

        // FUNCTIONS:           ========== ========== ========== ========== ========== ==========

        function pbkdf2(arg) {
            //  Can be any AES algorithm:
            //  "AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC"
            const aes = "AES-CBC";
            const param = {
                "name":       "PBKDF2",
                "salt":       stringToArrayBuffer(arg.salt),
                "iterations": arg.iterations,
                "hash":       arg.hash
            };

            const deferred = $q.defer();

            window.crypto.subtle
                .importKey("raw", stringToArrayBuffer(arg.password), {"name": "PBKDF2"}, false, ["deriveKey"])
                .then(function (baseKey) {
                    return window.crypto.subtle
                        .deriveKey(param, baseKey, {"name": aes, "length": 128}, true, ["encrypt", "decrypt"]);
                })
                .then(function (aesKey) {
                    return window.crypto.subtle.exportKey("raw", aesKey);
                })
                .then(function (keyBytes) {
                        deferred.resolve(btoa(arrayBufferToString(keyBytes)));
                    }, function () {
                        deferred.reject("Hashing error");
                    }
                );

            return deferred.promise;
        }

        function stringToArrayBuffer(byteString) {
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++)
                byteArray[i] = byteString.codePointAt(i);

            return byteArray;
        }

        function arrayBufferToString(buffer) {
            const byteArray = new Uint8Array(buffer);
            let byteString = '';
            for (let i = 0; i < byteArray.byteLength; i++)
                byteString += String.fromCodePoint(byteArray[i]);

            return byteString;
        }
    }
})();