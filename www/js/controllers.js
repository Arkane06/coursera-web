// To avoid browser errors like:
// ionic.bundle.js:26794 TypeError: Cannot read property 'hide' of undefined at Object.hide (ng-cordova.js:6837)
// ionic.bundle.js:26794 ReferenceError: Camera is not defined at controllers.js:108
var USE_IONIC_PLATFORM = false;

angular.module('dojoEvents.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter evet:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Activating the Modal in the Controller  
  $scope.reservation = {};

  // Create the new event modal that we will use later
  $ionicModal.fromTemplateUrl('templates/newevent.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.newEventform = modal;
  });

  // Triggered in the new Event modal to close it
  $scope.closeNewEvent = function() {
    $scope.newEventform.hide();
  };

  // Open the new Event modal
  $scope.newEvent = function() {
    $scope.newEventform.show();
  };

  // Perform the new Event action when the user submits the new Event form
  $scope.doNewEvent = function() {
    console.log('Creating new event', $scope.reservation);

    $timeout(function() {
      $scope.closeNewEvent();
    }, 1000);
  };
    
    $scope.registration = {};

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
  if (USE_IONIC_PLATFORM === true) {

    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();
        };
        
         // Assignement 4 - Task 1: Image Picker
        var optionsImagePicker = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
            };

        $scope.getPicture = function () {
          $cordovaImagePicker.getPictures(optionsImagePicker)
            .then(function (results) {
              $scope.registration.imgSrc = results[0];
            }, function(error) {
              console.log(error);
            });
        };

    });
  } // end if USE_IONIC_PLATFORM

})


    .controller('EventController', ['$scope', 'events', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, events, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            $scope.events = events;
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };

            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();
                
                if (USE_IONIC_PLATFORM === true) {
                    $ionicPlatform.ready(function () {
                            $cordovaLocalNotification.schedule({
                                id: 1,
                                title: "Added Favorite",
                                text: $scope.events[index].name
                            }).then(function () {
                                console.log('Added Favorite '+$scope.events[index].name);
                            },
                            function () {
                                console.log('Failed to add Notification ');
                            });

                            $cordovaToast
                            .show('Added Favorite '+$scope.events[index].name, 'long', 'center')
                            .then(function (success) {
                                // success
                            }, function (error) {
                                // error
                            });
                    });
                }// end if USE_IONIC_PLATFORM              
            }

        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])
        
        .controller('EventDetailController', ['$scope', '$stateParams', 'event', 'eventFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$timeout', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, event, eventFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $timeout, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.event = event;
            $scope.showEvent = false;
            $scope.message="Loading ...";
            
            $ionicPopover.fromTemplateUrl('templates/event-detail-popover.html', {
                scope: $scope
                }).then(function(popover) {
                    $scope.popover = popover;
                });

            $scope.openPopover = function($event) {
                $scope.popover.show($event);
            };  

            $scope.closePopover = function() {
                $scope.popover.hide();
            };
                           
            $scope.addFavorite = function () {
                console.log('Add favorite index ' + $scope.event.id);
                favoriteFactory.addToFavorites($scope.event.id);
                $scope.closePopover();
                
                // Assignment 4 Task 2
                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added favorite",
                        text: $scope.event.name
                    }).then(function () {
                        console.log('Added favorite ' + $scope.event.name);
                    }, function () {
                        console.log('Failed to add notification.');
                    });

                    $cordovaToast
                      .show('Added favorite ' + $scope.event.name, 'long', 'bottom')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });
                 });                
            };

            // Assignment 2 Task 3
            $scope.mycomment = {};

            $ionicModal.fromTemplateUrl('templates/event-comment.html', {
                scope: $scope
                }).then(function(modal) {
                    $scope.commentForm = modal;
            });

            $scope.closeComment = function() {
                $scope.commentForm.hide();
            };
                                                 
            $scope.addComment = function() {
                $scope.commentForm.show();
                $scope.closePopover();
            };

            $scope.doComment = function() {
                console.log('Submit comment ', $scope.mycomment);
                $scope.mycomment.date = new Date().toISOString();
                $scope.event.comments.push($scope.mycomment);
                eventFactory.update({id:$scope.event.id},$scope.event);
                $scope.mycomment = {};
                
                $timeout(function() {
                    $scope.closeComment();
                }, 1000);
            };  

        }])

        .controller('EventCommentController', ['$scope', 'eventFactory', function ($scope, eventFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.event.comments.push($scope.mycomment);
                eventFactory.update({id:$scope.event.id},$scope.event);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])
        

        .controller('IndexController', ['$scope', 'event', 'promotion', 'leader', 'baseURL', 
                                        function ($scope, event, promotion, leader, baseURL) {

            $scope.baseURL = baseURL;
            $scope.event = event;
            $scope.promotion = promotion;
            $scope.leader = leader;

        }])

        .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
            
            $scope.baseURL = baseURL;
            $scope.leaders = leaders;
            console.log($scope.leaders);
            
        }])

    .controller('FavoritesController', ['$scope', 'events', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration', function ($scope, events, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaVibration) {
        
        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;

        $scope.favorites = favorites;

        $scope.events = events;
        
        console.log($scope.events, $scope.favorites);

        $scope.toggleDelete = function () {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
            console.log($scope.shouldShowDelete);
        }

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                // Assignment 4 - Task 3: vibrate
                if (USE_IONIC_PLATFORM === true) {
                    $ionicPlatform.ready(function () {
                        $cordovaVibration.vibrate(100);
                    });
                }
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;
    }
    }])

    .filter('favoriteFilter', function () {
        return function (events, favorites) {
            var out = [];
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < events.length; j++) {
                    if (events[j].id === favorites[i].id)
                        out.push(events[j]);
                }
            }
            return out;
        }
    })
;
