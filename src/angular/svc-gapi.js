/* jshint ignore:start */
var isClientJS = false;
function handleClientJSLoad() {
  isClientJS = true;

  var evt = document.createEvent("Events");
  evt.initEvent("gapi.loaded", true, true);

  window.dispatchEvent(evt);
}
/* jshint ignore:end */

(function (angular) {
  "use strict";

  angular.module("risevision.widget.common.google-drive-picker")
    .factory("oauthAPILoader", ["$q", "$log", "gapiLoader",
      function ($q, $log, gapiLoader) {
        var deferred = $q.defer();
        var promise;

        var factory = {
          get: function () {
            if (!promise) {
              promise = deferred.promise;
              gapiLoader.get().then(function (gApi) {
                gApi.load("auth", function () {
                  $log.info("auth API is loaded");
                  deferred.resolve(gApi);
                });
              });
            }
            return promise;
          }
        };
        return factory;

      }])
    .factory("gapiLoader", ["$q", "$window",
      function ($q, $window) {

        var factory = {
          get: function () {
            var deferred = $q.defer(),
              gapiLoaded;

            if ($window.isClientJS) {
              deferred.resolve($window.gapi);
            } else {
              gapiLoaded = function () {
                deferred.resolve($window.gapi);
                $window.removeEventListener("gapi.loaded", gapiLoaded, false);
              };
              $window.addEventListener("gapi.loaded", gapiLoaded, false);
            }
            return deferred.promise;
          }
        };
        return factory;

      }])
    .factory("pickerLoader", ["$q", "$window", "$log", "gapiLoader",
      function($q, $window, $log, gapiLoader) {

        var factory = {
          get: function () {
            var deferred = $q.defer();
            var promise;

            if (!promise) {
              promise = deferred.promise;
              gapiLoader.get().then(function (gApi) {
                gApi.load("picker", function () {
                  $log.info("picker API is loaded");
                  deferred.resolve(gApi);
                });
              });
            }
            return promise;
          }
        };

        return factory;

      }]);

})(angular);


