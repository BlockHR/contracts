pragma solidity ^0.4.4;

contract User {
  address private owner;

  modifier owned() {
    if (msg.sender == owner) _;
  }

	struct UserData {
    string firstName;
    string lastName;
    uint256 age;
  }

  mapping(address => UserData) private users;

  event AddUser(
    address indexed ethAddress,
    string firstName,
    string lastName,
    uint256 age
  );

	function User() {
		owner = msg.sender;
	}

	function addUser(address ethAddress, string firstName, string lastName, uint256 age) public owned {
		if (users[ethAddress].age != 0) {
		  return;
		}
		UserData memory user;
		user.firstName = firstName;
		user.lastName = lastName;
		user.age = age;
		users[ethAddress] = user;
		AddUser(ethAddress, firstName, lastName, age);
	}

	function getUser(address ethAddress) public returns (string firstName, string lastName, uint256 age) {
	  if (ethAddress != msg.sender && msg.sender != owner) {
		  return;
		}
		if (users[ethAddress].age == 0) {
		  return;
		}
		firstName = users[ethAddress].firstName;
		lastName = users[ethAddress].lastName;
		age = users[ethAddress].age;
	}

	function () {
    revert();
  }
}
