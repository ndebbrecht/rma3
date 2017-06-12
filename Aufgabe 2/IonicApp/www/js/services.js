angular.module('starter.services', [])

.factory('Yugi', function($http) {
  //data aus json oder aus lc laden
  var yugis = [];
  var anzahl=11;

  localStorage.setItem('anzahl', JSON.stringify(anzahl));

  $http.get('yugi.json').success(function(jsonYugi){
    console.log(jsonYugi);
      /*yugis=jsonYugi.yugi;*/
      /*for(var i =0; i< jsonYugi.yugi.length;i++){
        yugis.push(jsonYugi.yugi[i]);
      }*/
      localStorage.setItem('yugi', JSON.stringify(jsonYugi.yugi));
  });
  return {
    all: function() {
      return JSON.parse(localStorage.getItem('yugis'));
    },
    remove: function(yugisr) {
      yugi.splice(yugi.indexOf(yugisr), 1);
    },
    get: function(yugiId) {
      for (var i = 0; i < yugis.length; i++) {
        if (yugis[i].id === parseInt(yugiId)) {
          return yugis[i];
        }
      }
      return null;
    }
  };
});
