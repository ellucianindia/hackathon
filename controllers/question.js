var app = angular.module('myApp', []);
app.controller('appCtrl', function($scope, $http) {
	$scope.getQuestion = function () {
		angular.element(document.querySelector("#questionTemplate")).removeClass("show");
		angular.element(document.querySelector("#questionTemplate")).addClass("hide");
		angular.element(document.querySelector("#qList")).removeClass("hide");
		angular.element(document.querySelector("#qList")).addClass("show");
		console.log($scope.question);
		$http.get("/question/byTitle/" + $scope.question).success(function(response) {
			$scope.questionList = response;
			console.log("question = " + response);
		});
	};
	$scope.getAnswer = function (id){
		angular.element(document.querySelector("#questionTemplate")).removeClass("hide");
		angular.element(document.querySelector("#questionTemplate")).addClass("show");
		angular.element(document.querySelector("#qList")).removeClass("show");
		angular.element(document.querySelector("#qList")).addClass("hide");
		$http.get('/question/byId/' + id).success(function(response) {
			$scope.title = response.title;
			$scope.userName = response.userName;
			$scope.publishedOn = response.publishedOn;
			$scope.answers = response.answers;
			$scope.ansCount = response.answers.length;
			console.log("answers = " + response);

		});
	};
	$scope.callGetQuestion = function(keyEvent) {
	  if (keyEvent.which === 13) {
		$scope.getQuestion();
	  }
	};
});
