'use strict';

var app = angular.module('myApp', ['angularModalService','angularjs-dropdown-multiselect']);
app.controller('appCtrl', function($scope, $http,ModalService) 
{
    $http.get("/users").success(function(response) 
	{
        $scope.userList = response;
    });
	
    $http.get("/tags").success(function(response) 
	{
        $scope.tagsList = response[0].tags;
        console.log(response)
        console.log(response[0].tags)
    });
    
	$scope.refresh = function () 
	{	
		window.location.reload();
	}
	
	$scope.findExpert = function () {	
		
		if($scope.searchKey != undefined){
			$http.get('/users/byExpertise/' + $scope.searchKey).success(function(response) {
				$scope.searchList = response;
				console.log(response);
			});
		}else{
			alert("Enter the Search String");
		}
	}

	$scope.findUser = function () {	
		$http.get('/users/byUsername/' + $scope.searchKey).success(function(response) {
			$scope.searchList = response;
		});
	}

	$scope.getTags = function () {	
		$http.get('/tags').success(function(response) {
			//use tags here
		});
	}
	
	$scope.upVote = function (id, user)
	{
		console.log("Up vote")
		$http.get('/users/' + id).success(function(response)
		{
			response.credits = ++user.credits;
			$http.put('/users/' + response._id, response).success(function(response) 
			{
				$scope.userList = response;
			});
		});
	}
	
	$scope.downVote = function (id, user)
	{	
		console.log("Down vote")
		$http.get('/users/' + id).success(function(response) 
		{
			console.log(response);
			response.credits = --user.credits;
			$http.put('/users/' + response._id, response).success(function(response) {
				$scope.userList = response;
			});
		});
	}
	
	$scope.adduser = function ()
	{
		if(!$scope.user.firstName == '' && !$scope.user.lastName == '' && !$scope.user.expertize == '' && !$scope.user.team == '') 
		{
			console.log($scope.user);
			$http.post("/users", $scope.user).success(function(response) 
			{
				console.log(response);
				$scope.userList = response;
				$scope.user.credits = '';
				$scope.user.firstName = '';
				$scope.user.lastName = '';
				$scope.user.expertize = '';
				$scope.user.team = '';
			 });
		}
		else
		{
			$http.get("/users").success(function(response) 
			{
				$scope.userList = response;
			});
		}
   
	
	};
	
	$scope.editUser = function (id)
	{
		console.log(id);
		$http.get('/users/' + id).success(function(response) 
		{
			$scope.user = response;
		});
	};
	
	$scope.deleteUser = function (id)
	{
		console.log(id);
		$http.delete('/users/' + id).success(function(response) 
		{
			$scope.userList = response;
		});
	};
	
	$scope.clearUser = function ()
	{
		$scope.user = '';
	};
	
	$scope.updateUser = function (id)
	{
		if(!$scope.user.firstName == '' && !$scope.user.lastName == '' && !$scope.user.expertize == '' && !$scope.user.team == '')
		{
			console.log($scope.user._id);
			$http.put('/users/' + $scope.user._id, $scope.user).success(function(response) 
			{
				$scope.userList = response;
				$scope.user.credits = '';
				$scope.user.firstName = '';
				$scope.user.lastName = '';
				$scope.user.expertize = '';
				$scope.user.team = '';
			});
		}
		else
		{
			$http.get("/users").success(function(response) 
			{
				$scope.userList = response;
			});
		}
	};
	
    $scope.showUser = function(id) {
    	$http.get('/users/' + id).success(function(response) {
			console.log(response);
			var expertise = getSkills(response.expertise);
			
			angular.element(document.querySelector("#userName")).text(response.firstName + " " + response.lastName); 
			angular.element(document.querySelector("#skills")).text(expertise); 
			angular.element(document.querySelector("#team")).text(response.team); 
			//angular.element(document.querySelector("#email")).text(response.email); 
			$('#email').prepend('<a href="mailto:'+response.email+'">'+response.email+'</a>');
			//angular.element(document.querySelector("#imageUrl")).src = ""; 
			$('#theImgDiv').prepend('<img id="imageUrl" alt="User Pic" src="../images/'+response.image+'" class="img-circle img-responsive" />')
			
		});
        ModalService.showModal({
            templateUrl: 'templateId',
            controller: "ModalController",
                resolve: {
                    details: function() {
                        return userProfile;
                    }
                }
        }).then(function(modal) {
        	console.log(modal);
            modal.element.modal();
        });
    };
    
    
    //posting questions api
	$scope.postQuestion = function () {	
		if($scope.question.title != undefined ){
		var userNameArray = ['svr2225','niket22', 'ravi43', 'jittojoset', 'shrik123'];
		var randomNum = Math.floor(Math.random() * userNameArray.length);
		console.log(userNameArray[randomNum]);
		$scope.question.userName = userNameArray[randomNum];
		$scope.question.publishedOn = new Date();
		$scope.question.answered = "No";
		$http.post('/postQuestion' ,$scope.question).success(function(response) {
			console.log(response.toString());
			
			 if (response == 200){
				 console.log("Hitting here");
				 openQuestionForum();
			 }
		});
	}else{
		
		alert("All Fields are mandatory")
	}
	};
	
	//On pressing Enter Key
	$scope.callFindExpert = function(keyEvent) {
		
		
		  if (keyEvent.which === 13) {
			$scope.findExpert();
		  }
		};
    
});




app.controller('ModalController', function($scope, close) {
	  
	 $scope.close = function(result) {
	 	close(result, 500); // close, but give 500ms for bootstrap to animate
	 };

	});

function getSkills(skills){
	var result=[];
	for(var i = 0; i < skills.length; i++){
		result.push(skills[i].name);
	}
	return result
}

function  openQuestionForum(){
	window.location = "/question.html";
}