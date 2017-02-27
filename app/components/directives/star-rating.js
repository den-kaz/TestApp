;
(function () {
    "use strict";

    angular
        .module("app.starRating", [])
        .directive('starRating', starRating);

    function starRating() {
        return {
            restrict: 'EA',
            templateUrl: "components/templates/stars.html",
            scope: {
                ratingValue:    '=ngModel',
                max:            '=?',
                onRatingSelect: '&?',
                readonly:       '=?'
            },
            link: function (scope, element, attributes) {
                scope.max = scope.max || 10;

                scope.toggle = function (index) {
                    if (scope.readonly) return;
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({"rating": scope.ratingValue});
                };

                scope.$watch('ratingValue', function (oldValue, newValue) {
                    if (newValue) {
                        if (!(scope.stars instanceof Array)){
                            scope.stars = [];
                            for (let i = 0; i < scope.max; i++)
                                scope.stars.push({"filled" : ( i < scope.ratingValue )});
                        } else {
                            for (let i = 0; i < scope.max; i++)
                                scope.stars[i].filled = i < scope.ratingValue;
                        }
                    }
                });
            }
        };
    }
})();