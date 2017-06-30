var app = angular.module('myApp', []);
app.controller('appCtrl', function($scope, $http) 
{
	$scope.getQuestion = function () {
		angular.element(document.querySelector("#questionTemplate")).removeClass("show");
		angular.element(document.querySelector("#questionTemplate")).addClass("hide");
		angular.element(document.querySelector("#qList")).removeClass("hide");
		angular.element(document.querySelector("#qList")).addClass("show");
		console.log($scope.question);
		$http.get("/question/byTitle/" + $scope.question1).success(function(response) {
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
			$scope.question = response;
			$scope.ansCount = response.answers.length;
			console.log(response);

		});
				angular.element(document.querySelector("#searchId")).val("");

	};

	$scope.callGetQuestion = function(keyEvent) {
	  if (keyEvent.which === 13) {
		$scope.getQuestion();
	  }
	};

	$scope.upVote = function (id, answer) {				
		$http.put('/upVote/' + id, answer).success(function(response) {
			++answer.credits;
			console.log("Upvoted")
		});
	}

	$scope.downVote = function (id, answer) {		
		$http.put('/downVote/' + id, answer).success(function(response) {
			--answer.credits;
			console.log("Downvoted")
		});
	}
});
