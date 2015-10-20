angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal


  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  //
  // // Triggered in the login modal to close it
  // // $scope.closeLogin = function() {
  // //   $scope.modal.hide();
  // // };
  // //
  // // // Open the login modal
  // // $scope.login = function() {
  // //   $scope.modal.show();
  // // };

  // Perform the login action when the user submits the login form

}).controller('loginCtrl', function($scope, $ionicPopup, $location, $http) {
  $scope.loginData = {};
  $scope.doLogin = function($event) {
    var req = {
      "method": "POST",
      "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
      "url": "http://71.72.219.85:8081/Authenticate",
      crossDomain : true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
      "data":{
        "username": $scope.loginData.username,
        "password": $scope.loginData.password,
        "grant_type": "password"
      }

    };
    console.log(JSON.stringify($scope.loginData));
    $http(req).then(function(data){
      console.log(JSON.stringify(data.data.access_token));
      if (data.data.access_token === null || data.data.access_token === undefined) {
        var alertPopup = $ionicPopup.alert({
          title: 'Incorrect username or password!',
          template: 'Please try again.'
        });
        alertPopup.then(function(res) {
          console.log(res);
        });
      } else {
        localStorage.setItem("Token", data.data.access_token);
        $location.path("/app/fishCatches");
      }
    },function(err){
      var alertPopup = $ionicPopup.alert({
        title: 'Incorrect username or password!',
        template: "Please try again, or sign up if you don't have an account"
      });
      alertPopup.then(function(res) {
        console.log(res);
      });
    });

  };
})

.controller('fishCatchesCtrl', function($scope,$http,$location) {
    if (localStorage.getItem("Token") === null) {
      $location.path("/app/login");
    }
    var req = {
      "method": "GET",
      "headers": {'Content-Type': 'application/json',
      "Authorization": "Bearer: " + localStorage.getItem("Token")},
      crossDomain : true,
      "url": "http://71.72.219.85:8081/api/FishCatchApi/getFishCatches"

    };
    $http(req).then(function(data){
      console.log(JSON.stringify(data));
    });

    $scope.fishcatches= [{
      lakename: "Patoka Lake"
    }];
  })
  .controller('newfishcatchCtrl', function($scope, $ionicLoading) {
    $scope.newfishcatchdata = {};

    $ionicLoading.show({
      template: 'Loading...'
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.newfishcatchdata.latitude = position.coords.latitude;
        $scope.newfishcatchdata.longitude = position.coords.longitude;
        $scope.$digest();

        $ionicLoading.hide();

      });

    } else {
      $ionicLoading.hide();
    }


  })
  .controller('fishcatchdetailCtrl', function($scope){
    $scope.fishcatch = {
      "lakename": "Patoka",
      "longitude": 39.12222,
      "detail": "This is a great catch, caught it on a crank bait 10 feet deep",
      "latitude": -84.1234
    };
  })
  .controller('lakesCtrl',function($scope){
    $scope.lakes = [{
      "lakename": "Patoka"
    },{
      "lakename": "Patoka"
    },
    {
      "lakename": "Patoka"
    },
    {
      "lakename": "Patoka"
    },
    {
      "lakename": "Patoka"
    },
    {
      "lakename": "Patoka"
    }];
  })
  .controller('newlakeCtrl', function($scope){
    $scope.lakedata = {};
  })
  .controller('signupCtrl', function($scope){

  })

.controller('PlaylistCtrl', function($scope, $stateParams) {});
