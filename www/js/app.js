// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])
.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'

    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('logout',{
      url: '/logout',
      views:{
        'menuContent': {
          controller: 'logoutCtrl',
          templateUrl: 'templates/logout.html'
        }
      }
    })
    .state('app.fishCatches', {
      url: '/fishCatches',
      views: {
        'menuContent': {
          templateUrl: 'templates/fishCatches.html',
          controller: 'fishCatchesCtrl'
        }
      }
    })
    .state('app.newfishcatch', {
      url: '/newfishcatch',
      views: {
        'menuContent': {
          templateUrl: 'templates/newfishcatch.html',
          controller: 'newfishcatchCtrl'
        }
      }
    })
    .state('app.fishcatchdetail', {
      url: '/fishcatchdetail',
      views: {
        'menuContent': {
          templateUrl: 'templates/fishcatchdetail.html',
          controller: 'fishcatchdetailCtrl'
        }
      }
    })
    .state('app.lakes', {
        url: '/lakes',
        cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/lakes.html',
          controller: 'lakesCtrl'
        }
      }
    })
    .state('app.newlake', {
      url: '/newlake',
      views: {
        'menuContent': {
          templateUrl: 'templates/newlake.html',
          controller: 'newlakeCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/fishCatches');
});
