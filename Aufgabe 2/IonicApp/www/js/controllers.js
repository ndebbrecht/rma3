angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('FriendsAddingCtrl', function($scope, $stateParams) {

    $scope.addFriend= function(){
          var yugis=[];
          var anzahl=JSON.parse(localStorage.getItem("anzahl"))+1;
          localStorage.setItem('anzahl', JSON.stringify(anzahl));

          //daten aus formular holen
          var art= $scope.yugioh.art;
          var name= $scope.yugioh.name;
          var alter= $scope.yugioh.alter;
          var kinderfreundlich= $scope.yugioh.kinderfreundlich;
          var charakter= $scope.yugioh.charakter;

          var yugioh={
              "id": anzahl,
              "art": art,
              "name": name,
              "alter": alter,
              "kinderfreundlich": kinderfreundlich,
              "charakter": charakter
          }

          //nach laden des Hometabs Deck entweder immer noch leer oder mit jsonDaten gefüllt
          if(localStorage.getItem('yugi')!=null){
            yugis=JSON.parse(localStorage.getItem("yugi"));
          }
          yugis.push(yugioh);
          localStorage.setItem('yugi', JSON.stringify(yugis));
          alert("pushing");

    }

   $scope.editFriend = function(item){
          var yugi=JSON.parse(localStorage.getItem('yugi'));
          alert("hi");
          item.art = yugi.art;
          item.name = yugi.name;
          item.alter = yugi.alter;
          item.kinderfreundlich = yugi.kinderfreundlich;
          item.charakter = yugi.charakter;
          removeFriend(item);
          //zubearbeitene daten im formular einfügen

  };
})


.controller('CharaDetailCtrl', function($scope, $stateParams) {





})

.controller('CharaCtrl', function($scope, Yugi, $http) { //Da liegt der Fehler beim Yugis
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $http.get('yugi.json').success(function(jsonYugi){
    $scope.yugis=jsonYugi.yugis;
    var anzahl=11;
    if(typeof(Storage) !== "undefined") {
      if(localStorage.getItem("yugi")){
        $scope.yugis = JSON.parse(localStorage.getItem("yugi"));
      }
      else{
        localStorage.clear();
        localStorage.removeItem("yugi");
        localStorage.setItem("yugi", JSON.stringify($scope.yugis));
      }
    }else{
      alert('Error.');
    }
 })
/*
   $scope.editFriend = function(item){
          //var yugi=JSON.parse(localStorage.getItem('yugi'));
          alert("hi");



          item.art = yugi.art;
          item.name = yugi.name;
          item.alter = yugi.alter;
          item.kinderfreundlich = yugi.kinderfreundlich;
          item.charakter = yugi.charakter;
          removeyugi(item);
          //zubearbeitene daten im formular einfügen

  };
*/
    $scope.removeFriend = function(item){
      if (confirm('Freund wirklich entfernen?')){
         $scope.yugi.splice($scope.yugi.indexOf(item),1);
      };
  };

})

.controller('CharaDetailCtrl', function($scope, $stateParams, Yugi) {

  $scope.yugis  = JSON.parse(localStorage.getItem("yugi"));
  var charaId= $stateParams.id;
  $scope.item = getFriend($scope.yugis, charaId);

  function getFriend(yugis, charaId) {
      var match;
      yugis.forEach(function(iter){
        if(angular.equals(iter.id,charaId)){
          match = iter;
          return match;
        }
      })
      return match;
  };
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
