;
(function () {
    "use strict";

    angular
        .module("app.search", ["ui.router"])
        .config(config)
        .controller("SearchController", searchController)
        .filter("priceRange", priceRange)
        .filter("dateRange", dateRange);

    searchController.$inject = [ "$log", "$state", "auth", "shop" ];

    function searchController( $log, $state, auth, shop ) {
        const self = this;
        self.ctrl = "searchController";
        $log.debug(`INIT CONTROLLER > ${self.ctrl} >`);

        // Check user authorization
        if (!auth.user.isAuth) {
            $log.error("User is not authorized!");
            return $state.go("login");
        }

        // Load products list
        shop.loadProducts();

        // Set accessible to stars toggle
        self.starsReadonly = false;

        self.cart =     shop.cart;
        self.products = shop.products;

        // Set range for date pickers
        self.date = {
            "min": new Date(2014, 0, 1),
            "max": new Date()
        };

        // Default filter parameters
        self.filter = {
            "date":  { "min" : new Date(2014, 0, 1), "max" : new Date() },
            "price": { "min": 10, "max": 10000 }
        };

        self.search = {
            "inStock":     undefined,
            "color":       undefined
        };


        self.order = order;
        self.rateFunction = rateFunction;

        // FUNCTIONS

        function order(id) {
            $log.debug(id);

            const index = indexByKey(self.products, "id", id );
            $log.debug(index, self.products[index]);

            self.products[index].inCart = !self.products[index].inCart;

            (self.products[index].inCart)
                ? self.cart.push(self.products[index])
                : spliceByKey(self.cart, "id", self.products[index].id);

            $log.debug(self.cart);
        }

        function rateFunction (rating) {
            // May be used for change product rating
            console.log('Rating selected: ' + rating);
        }

        // HELPERS

        function spliceByKey(arr, key, val) {
            let id = -1;

            for (let i = 0, len = arr.length; i < len; i++ ) {
                if ( arr[i][key] === val) {
                    id = i;
                    break;
                }
            }

            if (id > -1) arr.splice(id, 1);
        }

        function indexByKey(arr, key, val) {
            let id = -1;
            for (let i = 0, len = arr.length; i < len; i++)
                if (val === arr[i][key]) {
                    id = i;
                    break;
                }

            return id;
        }
    }

    function priceRange(){
        return function(arr, price){
            const result = [];
            for (var i in arr)
                if ((!price.min || arr[i].price > price.min ) && ( !price.max || arr[i].price < price.max))
                    result.push(arr[i]);

            return result;
        }
    }

    function dateRange(){
        return function(arr, date){
            const result = [];
            for (var i in arr)
                if ((!date.min || arr[i].issueDate > date.min ) && ( !date.max || arr[i].issueDate < date.max))
                    result.push(arr[i]);

            return result;
        }
    }

    config.$inject = ["$stateProvider"];

    function config($stateProvider) {
        $stateProvider.state("search", {
            "url": "/search",
            "templateUrl": "search/search.html",
            "controller": "SearchController",
            "controllerAs": "ctrl"
        })
    }
})();