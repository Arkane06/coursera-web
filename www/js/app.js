// Ionic Starter App

angular.module('dojoEvents', ['ionic', 'ngCordova', 'dojoEvents.controllers','dojoEvents.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
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
      $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);
  });

    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });    
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'IndexController',
        resolve: {
            event: ['eventFactory', function(eventFactory){
                return eventFactory.get({id: 0});
            }],
            leader: ['corporateFactory', function(corporateFactory){
                return corporateFactory.get({id: 0});
            }],
            promotion: ['promotionFactory', function(promotionFactory){
                return promotionFactory.get({id: 0});
            }]  
        }          
      }
    }
  })

    .state('app.events', {
      url: '/events',
      views: {
        'mainContent': {
          templateUrl: 'templates/search.html',
          controller: 'EventController',
          resolve: {
              events:  ['eventFactory', function(eventFactory){
                return eventFactory.query();
              }]
          }
        }
      }
    })

  .state('app.about', {
      url: '/about',
      views: {
        'mainContent': {
          templateUrl: 'templates/aboutapp.html',
          controller: 'AboutController',
          resolve: {
              leaders:  ['corporateFactory', function(corporateFactory){
                return corporateFactory.query();
              }]
          }
        }
      }
    })

   .state('app.organize', {
      url: '/organize',
      views: {
        'mainContent': {
          templateUrl: 'templates/organize.html',
        }
      }
    })

   .state('app.favorites', {
      url: '/favorites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html',
          controller:'FavoritesController',
          resolve: {
              events:  ['eventFactory', function(eventFactory){
                return eventFactory.query();
              }],
              favorites: ['favoriteFactory', function(favoriteFactory) {
                return favoriteFactory.getFavorites();
              }]
          }
        }
      }
    })

  .state('app.eventdetails', {
    url: '/event/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/eventdetail.html',
        controller: 'EventDetailController',
        resolve: {
            event: ['$stateParams','eventFactory', function($stateParams, eventFactory){
                return eventFactory.get({id:parseInt($stateParams.id, 10)});
            }]
        }
      }
    }
  });

   
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
