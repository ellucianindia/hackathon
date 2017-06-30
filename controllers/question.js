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
			$scope.question = response;
			$scope.ansCount = response.answers.length;
			console.log(response);

		});
	};
	$scope.callGetQuestion = function(keyEvent) {
	  if (keyEvent.which === 13) {
		$scope.getQuestion();
	  }
	};
	$scope.upVote = function (id,answer){
			alert(id+"--"+answer.answerid);
		$http.get('/question/byId/' +id).success(function(response) {
			console.log(response);
			for (var i = 0;i < response.answers.length;i++) {
				if(response.answers[i].answerid == answer.answerid){
					response.answers[i].credits = ++answer.credits;
				}
			}
			$http.put('/updateRating/' +response._id,response).success(function(response) {
				$scope.title = response[0].title;
				$scope.userName = response[0].userName;
				$scope.publishedOn = response[0].publishedOn;
				$scope.question = response[0];
				$scope.ansCount = response[0].answers.length;
			});
		});
	}
	$scope.downVote = function (id,answer){	
	alert(id+"--"+answer.answerid);
		$http.get('/question/byId/' +id).success(function(response) {
			console.log(response);
			for (var i = 0;i < response.answers.length;i++) {
				if(response.answers[i].answerid == answer.answerid){
					response.answers[i].credits = --answer.credits;
				}
			}
			$http.put('/updateRating/' +response._id,response).success(function(response) {
				$scope.title = response[0].title;
				$scope.userName = response[0].userName;
				$scope.publishedOn = response[0].publishedOn;
				$scope.question = response[0];
				$scope.ansCount = response[0].answers.length;
			});
		});
	}
});
