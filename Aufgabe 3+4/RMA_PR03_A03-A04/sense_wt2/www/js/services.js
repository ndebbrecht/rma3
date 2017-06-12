angular.module('starter.services', [])
// GPSService - GPS-Koordinaten abfragen und in Senselist übernehmen
.factory('GPSService', ['$http', '$rootScope', '$interval', 'Sensepoints', 'Settings', function($http, $rootScope, $interval, Sensepoints, Settings) {
    //
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
    var zweieins = lat2 -lat1;
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
        console.log('R' + R+' d' +d + ' dlat' +dLat + ' dlon' +dLon + ' a' +a +' zweieins' +zweieins +' lat2' +lat2  +' lat1' +lat1  );
      return d;
    }
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

    //
  var that = this;
  // Erstelle Sensepoint für aktuelle Position
  this.setPosition = function(position)
  {
    var crd = position.coords;
    var prevlati = 52.2843049;
    var prevlongi = 8.0208065;
    var lastid = Sensepoints.getMaxId();
    var prev = Sensepoints.get(lastid);
    var prevlati = prev.lat;
    var prevlongi = prev.lng;

    var lati = prevlati;
    var longi = prevlongi;
    if(Settings.getRandomOffset()){
        lati =  prevlati +(Math.floor((Math.random() * 200) - 100) /10000);
        longi = prevlongi +(Math.floor((Math.random() * 200) - 100) /10000);
    }
    else{
        lati = crd.latitude;
        longi = crd.longitude;
    }

    var hb = Sensepoints.getHb();
    var b = Math.floor((Math.random() * 2));
    if(b == 1){
        if(hb<180){
            hb +=0.5;
        }

    }
    else{
        if(hb>40){
            hb -= 0.5;
        }

    }
    Sensepoints.setHb(hb);
    var sweat = Sensepoints.getSweat();
    b = Math.floor((Math.random() * 2));
    if(b == 1){
        if(sweat<100){
            sweat +=0.5;
        }

    }
    else{
        if(sweat>40){
            sweat -= 0.5;
        }

    }
    Sensepoints.setSweat(sweat);
    Sensepoints.setDistance(Sensepoints.getDistance() + getDistanceFromLatLonInKm(prevlati,prevlongi,lati,longi))  ;


    var maxId = Sensepoints.getMaxId()+1;
    var sensepoint = {
        id: maxId,
        title: 'Sense Point '+maxId,
        lat: lati,
        lng: longi,
        date: '2017-28-04 12:23:34',
        heartbeat: hb,
        sweat: sweat,
        description: 'Alles gut!'
    }
    Sensepoints.add(sensepoint);
    Sensepoints.calcAvgHb(hb);
    // Änderungen der Werte bekanntmachen
  }

  var interval = null;
  return {
    // Starte GPS-Tracking
    startService: function() {
      if (!interval && Settings.getStarted())
      {
        interval = $interval(
          function()
          {
            if (navigator.geolocation)
            {
              navigator.geolocation.getCurrentPosition(that.setPosition);
            }
          },
          Settings.getDelay()
        );
      }
    },
    stopService: function() {

      $interval.cancel(interval);
      interval = null;
    }
  };
}])
// App-Settings
.factory('Settings', function() {
  var started = false;
  var randomOffset = true;
  var delay = 5000;

  return {
    getStarted: function() {
      return started;
    },
    setStarted: function(setStarted) {
      started=setStarted;
      if(started){
          var d = document.getElementById("stickman-div");
          d.className +=" distance-pulse";
          d.classList.add("running-stickman");

      }
        else{
            var d = document.getElementById("stickman-div");
            d.className -=" distance-pulse";
            d.classList.remove("running-stickman");
        }
    },
    getRandomOffset: function() {
      return randomOffset;
    },
    setRandomOffset: function(setRandomOffset) {
      randomOffset=setRandomOffset;
    },
    getDelay: function() {
      return delay;
    },
    setDelay: function(setDelay) {
      delay=setDelay;
    }
  };
})
.factory('Dash', function() {

  return {


  };
})
// Sensepoints "Model"
.factory('Sensepoints', ['$rootScope', function($rootScope) {
  // Might use a resource here that returns a JSON array
  var distance = 0;
  // Some fake testing data
  var sensepoints = [{
    id: 1,
    title: 'Sense Point 1',
    lat: 52.2843049,
    lng: 8.0208065,
    date: '2017-29-04 12:23:34',
    heartbeat: 80,
    sweat: 50,
    description: 'Alles gut!'
  }];
  var hb = Math.floor((Math.random()*(180-40)) +40);
  var sweat = Math.floor((Math.random()*(100-40)) +40);
  var avgHb = hb;
  return {
    all: function() {
      return sensepoints;
    },
    calcAvgHb: function(a) {
      console.log('ss'+avgHb);
      avgHb = ((avgHb+a)/2);
    },
    getMaxId: function() {
      var maxId = 0;
      for (var i = 0; i < sensepoints.length; i++) {
        if (sensepoints[i].id > maxId) {
          maxId = sensepoints[i].id;
        }
      }
      return maxId;
    },
    remove: function(sensepoint) {
      sensepoints.splice(sensepoints.indexOf(sensepoint), 1);
    },
    add: function(sensepoint) {
      sensepoints.push(sensepoint);
      $rootScope.$apply();
    },
    get: function(sensepointId) {
      for (var i = 0; i < sensepoints.length; i++) {
        if (sensepoints[i].id === parseInt(sensepointId)) {
          return sensepoints[i];
        }
      }
      return null;
    },
    getHb: function() {
      return hb;
    },
    getAvgHb: function() {
      return avgHb;
    },
    setHb: function(setHb) {
      hb=setHb;
    },
    getSweat: function() {
      return sweat;
    },
    setSweat: function(setSweat) {
      sweat= setSweat;
    },
    getDistance: function() {
      return distance;
    },
    setDistance: function(setDistance) {
      distance=setDistance;
    }
  };
}]);
