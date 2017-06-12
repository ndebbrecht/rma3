angular.module('starter.controllers', [])
// Dashboard-Controller
.controller('DashCtrl', function($scope, $compile, $ionicLoading, GPSService, Sensepoints) {
  GPSService.startService();
  $scope.distance = Sensepoints.getDistance();
  $scope.heartbeat = Sensepoints.getHb();
  function initialize() {
    var prevHB = Sensepoints.getHb();
    // Sensepoints ueberwachen, be Aenderung Funktion aufrufen und Pfad neu malen
    $scope.$watch('sensepoints', function(newVal) {
        
        console.log(Sensepoints.getDistance());
        console.log(Sensepoints.getAvgHb());
        $scope.distance = Sensepoints.getDistance().toFixed(2);
        $scope.heartbeat = Sensepoints.getAvgHb().toFixed(2);
        $scope.heartbeat = Sensepoints.getHb();
        var x = (($scope.distance +Sensepoints.getHb())/2).toFixed(2);
        //$scope.heartbeat = ((prevHB+Sensepoints.getHb())/2).toFixed2;
        document.getElementById("heart-shape-wrapper").style.animationDuration = ( 60/Sensepoints.getHb() )+'s';
    }, true);
  }

    // distance:
    
    
    
  // Sensepoints aus Model initialisieren
  $scope.sensepoints = Sensepoints.all();
  // Pfad initialisieren
  

  // Wenn DOM geladen wurde: Karte initialisieren
  ionic.DomUtil.ready(
    function()
    {
      initialize();
    }
  )
})
        
 
.controller('AnleitungCtrl', function($scope, $interval, Sensepoints, GPSService) {
  // Muss leider in jedem Controller gestartet werden
  GPSService.startService();
})

// Sensepoints-Liste-Controller
.controller('SensepointsCtrl', function($scope, Sensepoints, $interval, GPSService) {
  // Muss leider in jedem Controller gestartet werden
  GPSService.startService();
  
  $scope.sensepoints = Sensepoints.all();
  $scope.remove = function(sensepoint) {
    Sensepoints.remove(sensepoint);
  };
})
// Sensepoints-Detail-Controller
.controller('SensepointDetailCtrl', function($scope, $stateParams, Sensepoints, GPSService) {
  $scope.sensepoint = Sensepoints.get($stateParams.sensepointId);
  // Muss leider in jedem Controller gestartet werden
  GPSService.startService();
})

// Settings-Controller
.controller('SettingsCtrl', function($scope, GPSService, Settings) {
  // Muss leider in jedem Controller gestartet werden
  GPSService.startService();
    
  $scope.started = Settings.getStarted();
  $scope.randomOffest = Settings.getRandomOffset();
  $scope.delay = Settings.getDelay();

  $scope.changeDelay = function(setDelay) {
    // Sliderwert als neuen delay-Wert setzen
    document.getElementById("stickman-div").style.animationDuration = setDelay+'ms';
    GPSService.stopService();
    Settings.setDelay(setDelay);
    GPSService.startService(); 
  };

  $scope.switchStarted = function() {
    // started umkehren, in Settings schreiben und GPSService starten/stoppen
    $scope.started = !$scope.started;
    Settings.setStarted($scope.started);
    if (!$scope.started)
    {
      GPSService.stopService();
    }
    else
    {
      GPSService.startService(); 
    }
  };

  $scope.switchRandomOffset = function() {
    // randomOffset umkehren und in Settings schreiben
    $scope.randomOffest = !$scope.randomOffest;
    Settings.setRandomOffset($scope.randomOffest);
  };

})
// Katen-Controller
.controller('MapCtrl', function($scope, $compile, $ionicLoading, GPSService, Sensepoints) {
  GPSService.startService();
  $scope.map = null;
  function initialize() {
    // Koordinaten Medienlabor
    var myLatlng = new google.maps.LatLng(52.2843049,8.0208065);
    
    // Kartenoptionen setzen
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Karte initialisieren (id="map")
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    // Aktuellem Scope die Karte zuweisen
    $scope.map = map;

    // Polylinie initialisieren
    var poly = new google.maps.Polyline({
        map: map,
        path: [],
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });
    var current = 0;
    // Sensepoints ueberwachen, be Aenderung Funktion aufrufen und Pfad neu malen
    $scope.$watch('sensepoints', function(newVal) {
        if(newVal.length > 0){
            var path = poly.getPath();
            for(;current < newVal.length; current++){
                path.push(new google.maps.LatLng(newVal[current].lat,newVal[current].lng));
            }
            poly.setPath(path);
            //console.log(Sensepoints.getDistance());
        }
    }, true);
  }

    // distance:
    
    
    
  // Sensepoints aus Model initialisieren
  $scope.sensepoints = Sensepoints.all();
  // Pfad initialisieren
  $scope.path = [];

  // Wenn DOM geladen wurde: Karte initialisieren
  ionic.DomUtil.ready(
    function()
    {
      initialize();
    }
  )
})
