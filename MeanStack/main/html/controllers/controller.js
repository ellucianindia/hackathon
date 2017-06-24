var app = angular.module('myApp', []);
app.controller('appCtrl', function($scope, $http) {
    $http.get("/contactlist")
    .success(function(response) {
        $scope.contactList = response;
    });
	//$scope.rating=123;
	/* person1={
		name:"abc",
		email:"abc@gmail.com",
		number:"1111111"
	};
	person2={
		name:"aaa",
		email:"aaa@gmail.com",
		number:"222222222"
	};
	person3={
		name:"ccc",
		email:"ccc@gmail.com",
		number:"33333333"
	};
	var contactList1 =[person1,person2,person3];
	$scope.contactList = contactList1; */
	$scope.refresh = function (){	
		window.location.reload();
	}
	$scope.upVote = function (id,contact){	
		$http.get('/contactlist/' +id).success(function(response) {
			console.log(response);
			response.rating =++contact.rating;
			$http.put('/contactlist/' +response._id,response).success(function(response) {
				$scope.contactList = response;
			});
		});
	}
	$scope.downVote = function (id,contact){	
		$http.get('/contactlist/' +id).success(function(response) {
			console.log(response);
			response.rating =--contact.rating;
			$http.put('/contactlist/' +response._id,response).success(function(response) {
				$scope.contactList = response;
			});
		});
	}
	$scope.addContact = function (){
		if(!$scope.contact.name=='' && !$scope.contact.email=='' && !$scope.contact.number==''){
			console.log($scope.contact);
			$http.post("/contactlist",$scope.contact).success(function(response) {
				$scope.contactList = response;
				console.log(response);
				$scope.contact.rating='';
				$scope.contact.name='';
				$scope.contact.email='';
				$scope.contact.number='';
			 });
		}else{
			$http.get("/contactlist")
			.success(function(response) {
				$scope.contactList = response;
			});
		}
   
	
	};
	$scope.editContact = function (id){
		console.log(id);
		$http.get('/contactlist/' +id).success(function(response) {
			$scope.contact = response;
		});
	};
	$scope.deleteContact = function (id){
		console.log(id);
		$http.delete('/contactlist/' +id).success(function(response) {
			$scope.contactList = response;
		});
	};
	$scope.clearContact = function (){
		$scope.contact='';
	};
	$scope.updateContact = function (id){
		if(!$scope.contact.name=='' && !$scope.contact.email=='' && !$scope.contact.number==''){
		console.log($scope.contact._id);
		$http.put('/contactlist/' +$scope.contact._id,$scope.contact).success(function(response) {
			$scope.contactList = response;
			$scope.contact.rating='';
			$scope.contact.name='';
			$scope.contact.email='';
			$scope.contact.number='';
		});
		}else{
			$http.get("/contactlist")
			.success(function(response) {
				$scope.contactList = response;
			});
		}
	};
});