var app = angular.module('myApp', []);
app.controller('appCtrl', function($scope, $http) 
{
	$http.get("/question/byTitle/" + $scope.searchQuestion).success(function(response) {
		$scope.questionList = response;
		console.log("question = " + response);
	});
	
	$scope.getQuestion = function () {
		angular.element(document.querySelector("#questionTemplate")).removeClass("show");
		angular.element(document.querySelector("#questionTemplate")).addClass("hide");
		angular.element(document.querySelector("#qList")).removeClass("hide");
		angular.element(document.querySelector("#qList")).addClass("show");
		angular.element(document.querySelector("#postAnswer")).removeClass("show");
		angular.element(document.querySelector("#postAnswer")).addClass("hide");
		angular.element(document.querySelector("#back")).removeClass("show");
		angular.element(document.querySelector("#back")).addClass("hide");
		console.log($scope.searchQuestion);
		$http.get("/question/byTitle/" + $scope.searchQuestion).success(function(response) {
			$scope.questionList = response;
			console.log("question = " + response);
		});
	};

	$scope.getAnswer = function (id){
		angular.element(document.querySelector("#questionTemplate")).removeClass("hide");
		angular.element(document.querySelector("#questionTemplate")).addClass("show");
		angular.element(document.querySelector("#qList")).removeClass("show");
		angular.element(document.querySelector("#qList")).addClass("hide");
		angular.element(document.querySelector("#postAnswer")).removeClass("hide");
		angular.element(document.querySelector("#postAnswer")).addClass("show");
		angular.element(document.querySelector("#back")).removeClass("hide");
		angular.element(document.querySelector("#back")).addClass("show");
		$http.get('/question/byId/' + id).success(function(response) {
			$scope.title = response.title;
			$scope.tags = response.tags;
			$scope.userName = response.userName;
			$scope.publishedOn = response.publishedOn;
			$scope.question = response;
			if (response.answers)
				$scope.ansCount = response.answers.length;
			else
				$scope.ansCount = 0;
			console.log(response);

		});
				angular.element(document.querySelector("#searchId")).val("");

	};
	$scope.set_color = function (isAnswered) {
	  if (isAnswered.toLowerCase() =="no") {
		return { color: "red" }
	  }
	};
	
	$scope.callGetQuestion = function(keyEvent) {
			$scope.getQuestion();
	  //if (keyEvent.which === 13) {
		//$scope.getQuestion();
		/* if (keyEvent.keyCode === 8) {
			alert($scope.searchQuestion);
			$scope.getQuestion();
		} */
	 // }
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
	};
	$scope.postAnswer = function (id){	
		var comments = [];
		var answer={
			accepted:"false",
			answerid:"ans"+getRandomInt(1,1000),
			comments:comments,
			content:$scope.postedAnswer,
			credits:0,
			publishedOn:new Date(),
			userName:"usr"+getRandomInt(1,3000)
		}
		console.log(answer);
		if($scope.postedAnswer.length>0){
			$http.put('/postAnswer/' +id,answer).success(function(response) {
				$http.get('/question/byId/' + id).success(function(response) {
					$scope.title = response.title;
					$scope.tags = response.tags;
					$scope.userName = response.userName;
					$scope.publishedOn = response.publishedOn;
					$scope.question = response;
					$scope.ansCount = response.answers.length;
					console.log(response);
					$scope.postedAnswer="";
					angular.element(document.querySelector("#answerId")).val("");
				});
			});
		}
	}
});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function home() {
	window.location = '/'; 
};
function back() {
	document.referrer;
	window.history.go(-2);
};