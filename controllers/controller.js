'use strict';

var app = angular.module('myApp', []);
app.controller('appCtrl', function($scope, $http) 
{
    $http.get("/users").success(function(response) 
	{
        $scope.userList = response;
    });
	
	$scope.refresh = function () 
	{	
		window.location.reload();
	}
	
	$scope.findExpert = function () {	
		$http.get('/users/byExpertise/' + $scope.searchKey).success(function(response) {
			$scope.searchList = response;
		});
	}

	$scope.findUser = function () {	
		$http.get('/users/byUsername/' + $scope.searchKey).success(function(response) {
			$scope.searchList = response;
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
		$scope.user='';
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
});