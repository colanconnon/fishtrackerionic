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
      method: 'POST',
        url: 'http://localhost:3001/api/users/Token',
        headers: {
          'Content-Type': 'Application/json'
        },
      "data":{
        "username": $scope.loginData.username,
        "password": $scope.loginData.password
      }
    
    };
    console.log(JSON.stringify($scope.loginData));
    $http(req).then(function(data){
      if (data.data.token) {
        localStorage.setItem("Token", data.data.token);
        $location.path("/app/fishCatches");
      } else {
          var alertPopup = $ionicPopup.alert({
          title: 'Incorrect username or password!',
          template: 'Please try again.'
        });
        alertPopup.then(function(res) {
          console.log(res);
        });
    
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
        "url": "http://localhost:3001/api/fishcatch/",
      "headers": {'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("Token")},
      crossDomain : true
     

    };
    $http(req).then(function(data){
        $scope.fishcatches = data.data.fishCatches;
        console.log(JSON.stringify($scope.fishcatches));
    });

   
  })
  .controller('newfishcatchCtrl', function($scope, $ionicLoading,$ionicHistory, $http,$ionicPopup,$state) {
      $scope.newfishcatchdata = {};
      var req = {
          "method": "GET",
          "url": "http://localhost:3001/api/lake/",
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
        "url": "http://localhost:3001/api/fishcatch/",
        "headers": {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("Token")
        },
        crossDomain: true,
        data: {
              temperature: $scope.newfishcatchdata.temperature,
          longitude: $scope.newfishcatchdata.longitude,
          latitude: $scope.newfishcatchdata.latitude,
          lake: $scope.newfishcatchdata.lake,
          details: $scope.newfishcatchdata.details
        } 
      };
     
      $http(req).then(function (data) {
        console.log(data);
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: "Your fish catch has been saved."
        });
        alertPopup.then(function (res) {
          console.log(res);
          $state.go("app.fishCatches");
        });
      }, function (data) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: "Error saving the catch, please check all fields and try again"
          });
          alertPopup.then(function (res) {
            console.log(res);
          });
        });
    };
  })
  .controller('fishcatchdetailCtrl', function ($scope,$location, $http) {
      var fishCatchId = $location.search().fishCatchId;
      console.log(fishCatchId);
      $http.useXDomain = true;
      var req = {
          "method": "GET",
          "url": "http://localhost:3001/api/fishcatch/catchdetail/"+fishCatchId,
          "headers": {
              'Content-Type': 'application/json',
              "Authorization": "Bearer: " + localStorage.getItem("Token")
          }
          


      };
      $http(req).then(function (data) {
          console.log(JSON.stringify(data.data));
          $scope.fishcatch = data.data.fishcatch;
      });

  })
  .controller('lakesCtrl', function ($scope, $http) {
      var req = {
          "method": "GET",
           "url": "http://localhost:3001/api/lake/",
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
  .controller('newlakeCtrl', function ($scope, $http, $ionicPopup, $state, $ionicHistory) {
      $scope.lakedata = {};
      $scope.newLakeSubmit = function () {
          console.log($scope.lakedata);
          var req = {
              "method": "POST",
              "url": "http://localhost:3001/api/lake/",
              "headers": {
                  'Content-Type': 'application/json',
                  "Authorization": "Bearer " + localStorage.getItem("Token")
              },
              crossDomain: true,
              data: { name: $scope.lakedata.name }
          };

          $http(req).then(function (data) {
              console.log(data);
              var alertPopup = $ionicPopup.alert({
                  title: 'Success',
                  template: "Your lake has been saved."
              });
              $ionicHistory.nextViewOptions({
                  disableBack: true
              });
              alertPopup.then(function (res) {
                  console.log(res);
                

                  $state.go("app.lakes");
              });
          });
      };
    
  })
  .controller('signupCtrl', function($scope,$http, $ionicPopup,$state){
    $scope.registerdata = {};
    $scope.registerClick = function() {
      if ($scope.confirmPassword === $scope.password) {
        var req = {
          method: 'POST',
          url: 'http://localhost:3001/api/users/register',
          headers: {
            'Content-Type': "Application/json"
          },
          data: {
            username: $scope.registerdata.username,
            password: $scope.registerdata.password,
            confirmPassword: $scope.registerdata.confirmPassword
          }
        };
        console.log(req);
        $http(req).then(function(data) {
          if (data.data.user) {
            console.log(data.data.user);
              var alertPopup = $ionicPopup.alert({
                  title: 'Saved user',
                  template: "You are now registered, please login."
              });
               alertPopup.then(function (res) {
                  console.log(res);
                  $state.go("login");
              });
          } else {
            console.log(data);
          }
        }, function() {
          //error
        });
      } else {
  
      }

    };
  })

.controller('PlaylistCtrl', function($scope, $stateParams) {});
