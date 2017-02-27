;
(function () {
    "use strict";

    angular
        .module("app.shopService", [])
        .factory("shop", shopService);

    shopService.$inject = ["$http", "$q", "$log"];

    function shopService($http, $q, $log) {
        const self = this;

        self.cart = [];

        self.products = [];
        self.colors = {
            "None":   0,
            "Red":    1,
            "White":  2,
            "Black":  3,
            "Blue":   4,
            "Yellow": 5,
            "Green":  6,
        };

        self.public = {
            cart:     self.cart,
            products: self.products,

            loadProducts: loadProducts
        };

        return self.public;

        // FUNCTIONS:

        function loadProducts() {
            const deferred = $q.defer();
            const url = "products.json";

            $log.debug("READ > shopService.loadProducts(): url =", url);

            self.products.length = 0;

            $http.get(url).then(
                function (response) {
                    $log.debug("READ SUCCESS > shopService.loadProducts(): data =", response.data);

                    const products = response.data;
                    const rate = rateParam(products, "rating");

                    $log.debug("Products Rating. Min =", rate.min, "Max = ", rate.max, "Value =", rate.val);

                    const now = new Date().getTime();

                    for (let i = 0, len = products.length; i < len; i++) {
                        const c = {
                            "id":        products[i].id,
                            "name":      products[i].name,
                            "color":     self.colors[products[i].color],
                            "issueDate": new Date(products[i].issueDate),
                            "price":     products[i].price,
                            "rate":      ~~((products[i].rating - rate.min) / rate.val * 5) + 1,
                            "inStock":   products[i].inStock,
                            "image":     products[i].image,
                            "inCart":    false
                        }

                        self.products.push(c);
                    }

                    $log.debug("Products :", self.products, "\n Time :", +now);

                    deferred.resolve(self.products.length);
                },
                function (response) {
                    $log.debug("READ ERROR > shopService.loadProducts(): status =", response.status, ", data =", response.data);
                    deferred.reject(response.status);
                });

            return deferred.promise;
        }

        function rateParam(arr, key) {
            const r = {
                "min": arr[0][key],
                "max": arr[0][key],
                "val": 0
            }

            if (arr.length > 1) {
                for (let i = 1, len = arr.length; i < len; i++) {
                    if (arr[i][key] > r.max) r.max = arr[i][key];
                    if (arr[i][key] < r.min) r.min = arr[i][key];
                }
            }

            r.val = r.max - r.min;

            return r;
        }
    }
})();

