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
    $http.defaults.useXDomain = true;
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
    $http.useXDomain = true;
    var req = {
        "method": "GET",
        "url": "http://71.72.219.85:8081/api/FishCatchApi/getFishCatches",
      "headers": {'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("Token")},
      crossDomain : true
     

    };
    $http(req).then(function(data){
        $scope.fishcatches = data.data.fishCatches;
        console.log(JSON.stringify($scope.fishcatches));
    });

   
  })
  .controller('newfishcatchCtrl', function($scope, $ionicLoading, $http,$ionicPopup) {
      $scope.newfishcatchdata = {};
      var req = {
          "method": "GET",
          "url": "http://71.72.219.85:8081/api/LakeApi/getLakes",
          "headers": {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + localStorage.getItem("Token")
          },
          crossDomain: true


      };
      $http(req).then(function (data) {
          console.log(data.data);
          $scope.lakes = data.data.lakes;
          console.log(JSON.stringify($scope.lakes));
      });

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

    $scope.newCatchSubmit = function () {
        $ionicLoading.show({
            template: 'Processing Save...'
        });
        console.log(JSON.stringify($scope.newfishcatchdata));
        var req = {
            "method": "POST",
            "url": "http://71.72.219.85:8081/api/FishCatchApi/NewFishCatch/",
            "headers": {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("Token")
            },
            crossDomain: true,
            data: $scope.newfishcatchdata
        };
        $http(req).then(function (data) {
            console.log(data);
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Success',
                template: "Your fish catch has been saved."
            });
            alertPopup.then(function (res) {
                console.log(res);
            });
        });
    }
  })
  .controller('fishcatchdetailCtrl', function ($scope,$location, $http) {
      var fishCatchId = $location.search().fishCatchId;
      console.log(fishCatchId);
      $http.useXDomain = true;
      var req = {
          "method": "GET",
          "url": "http://71.72.219.85:8081/api/FishCatchApi/getFishCatch?fishCatchId="+fishCatchId,
          "headers": {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + localStorage.getItem("Token")
          },
          crossDomain: true


      };
      $http(req).then(function (data) {
          console.log(JSON.stringify(data.data));
          $scope.fishcatch = data.data;
      });

  })
  .controller('lakesCtrl',function($scope, $http){
      var req = {
          "method": "GET",
          "url": "http://71.72.219.85:8081/api/LakeApi/getLakes",
          "headers": {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + localStorage.getItem("Token")
          },
          crossDomain: true


      };
      $http(req).then(function (data) {
          console.log(data.data);
          $scope.lakes = data.data.lakes;
          console.log(JSON.stringify($scope.lakes));
      });

  })
  .controller('newlakeCtrl', function($scope){
    $scope.lakedata = {};
  })
  .controller('signupCtrl', function($scope){

  })

.controller('PlaylistCtrl', function($scope, $stateParams) {});
