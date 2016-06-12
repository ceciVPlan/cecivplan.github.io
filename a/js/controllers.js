angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

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
  $scope.doLogin = function() {

    firebase.auth().signInWithEmailAndPassword($scope.loginData.username + "@example.com", $scope.loginData.password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode === 'auth/wrong-password'){
        alert('Wrong Password');
      }else{
        console.error(error);
      }
    })

    var slct = document.getElementById("yearSlct");
    var stufe = slct.options[slct.selectedIndex].value;
    localStorage.setItem("stufe", stufe);



    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('VPlanCtrl', function($scope){
  $scope.title = "Vertretungsplan";
  $scope.vData = "";

  $scope.getData = function(personal){
    var myTable = "";
    firebase.auth().onAuthStateChanged(function(user){
      var uid = "";
      if(user){
        //User is logged-in!
        uid = user.uid;

        firebase.database().ref('users/' + uid + '/').on('value', function(snapshot){
          var data = snapshot.val();
          var datum = "99.99";
          var slct = document.getElementById("stufeSlct");
          var stufe;

          switch ($scope.jahrgang) {
            case 'EF':
              stufe = data.EF;
              break;
            case 'Q1':
              stufe = data.Q1;
              break;
            case 'Q2':
              stufe = data.Q2;
              break;
          }

          if(personal){
            var facher = JSON.parse(localStorage.getItem("facher"));
            if(facher==null || facher.length==0){
              alert("Füge deine Fächer hinzu!");
            }else{
              for(var i=1;i<stufe.length-1; i++){
                var obj = stufe[i];
                for(var j=0;j<facher.length;j++){
                  var fach=facher[j];
                  if(obj.Fach.toUpperCase() == fach.toUpperCase()){
                    if(datum == obj.Datum){
                      myTable+= "<div class='row'><div class='col'>"+obj.Fach+"</div>";
                      myTable+= "<div class=col>"+obj.Stunde+"</div>";
                      myTable+= "<div class=col>"+obj.Vertreter+"</div>";
                      myTable+= "<div class=col>"+obj.Raum+"</div>";
                      myTable+= "<div class=col>"+obj['Vertretungs-Text']+"</div></div>";
                    }else{
                      myTable+= "<div class='row'><div class='colD'>"+obj.Tag+"</div>";
                      myTable+= "<div class='colD'>"+obj.Datum+"</div></div>";

                      myTable+= "<div class='row'><div class='col'>"+obj.Fach+"</div>";
                      myTable+= "<div class=col>"+obj.Stunde+"</div>";
                      myTable+= "<div class=col>"+obj.Vertreter+"</div>";
                      myTable+= "<div class=col>"+obj.Raum+"</div>";
                      myTable+= "<div class=col>"+obj['Vertretungs-Text']+"</div></div>";
                    }
                    datum = obj.Datum;
                  }
                }
              }
            }
          }else{
            for(var i=1;i<stufe.length-1; i++){
              var obj = stufe[i];
              if(datum == obj.Datum){
                myTable+= "<div class='row'><div class='col'>"+obj.Fach+"</div>";
                myTable+= "<div class=col>"+obj.Stunde+"</div>";
                myTable+= "<div class=col>"+obj.Vertreter+"</div>";
                myTable+= "<div class=col>"+obj.Raum+"</div>";
                myTable+= "<div class=col>"+obj['Vertretungs-Text']+"</div></div>";
              }else{
                myTable+= "<div class='row'><div class='colD'>"+obj.Tag+"</div>";
                myTable+= "<div class='colD'>"+obj.Datum+"</div></div>";

                myTable+= "<div class='row'><div class='col'>"+obj.Fach+"</div>";
                myTable+= "<div class=col>"+obj.Stunde+"</div>";
                myTable+= "<div class=col>"+obj.Vertreter+"</div>";
                myTable+= "<div class=col>"+obj.Raum+"</div>";
                myTable+= "<div class=col>"+obj['Vertretungs-Text']+"</div></div>";
              }
              datum = obj.Datum;
            }

          }
          document.getElementById("table").innerHTML = myTable;
        })

      }
    });
  }

  angular.element(document).ready(function() {
    $scope.jahrgang="EF"
    $scope.getData(false);
  })


  $scope.stufe = function(stufe){
    $scope.jahrgang=stufe;
    $scope.getData(false);
  }

  $scope.personal = function(){
    $scope.jahrgang= localStorage.getItem("stufe");
    $scope.getData(true);
  }


})

.controller('BrowseCtrl', function($scope, $timeout){
  $scope.title = "VPlan";

  $scope.content= [
    {name:'E EFa'},
    {name:'D EFa'}
  ];

  $scope.savedFacher=JSON.parse(localStorage.getItem("facher"));

  $scope.removeFach = function(kurs){
    var facher = $scope.savedFacher;
    if(facher!=null){
      for(var i=0;i<facher.length;i++){
        var fach=facher[i];
        if(fach==kurs){
          facher.splice(i, 1);
          localStorage.setItem("facher", JSON.stringify(facher));
        }
      }
    }
  }

  $scope.rmFach = function(kurs){
    console.log(kurs);
    var facher = $scope.savedFacher;
    if(facher!=null){
      for(var i=0;i<facher.length;i++){
        var fach=facher[i];
        if(fach==kurs){
          facher.splice(i, 1);
          localStorage.setItem("facher", JSON.stringify(facher));
        }
      }
    }
  }

  $scope.showFacher = function() {
    var facher = $scope.savedFacher;
    var output ="";
    if(facher!=null){
      for(var i=0;i<facher.length;i++){
        var fach=facher[i];
        output+="<div class='item item-text-wrap'>"+fach+"<button class='button button-assertive' ng-click=\"rmFach(\'"+fach+"\')\">Löschen</button></div>";
      }
      document.getElementById('facherList').innerHTML=output;
    }
  }

  $scope.addFach = function(){
    var facher=[];
    facher=JSON.parse(localStorage.getItem("facher"));
    if(facher==null){
      facher=[document.getElementById("facherFach").value];
    }else {
      facher.push(document.getElementById("facherFach").value);
    }
    localStorage.setItem("facher", JSON.stringify(facher));
    $scope.showFacher();
  }







})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
