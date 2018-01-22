var User = artifacts.require("./User.sol");

contract('User', function (accounts) {
  it("should add user", function () {
    let user;
    let AddUser;

    return User.deployed().then(function (instance) {
      user = instance;
      AddUser = instance.AddUser();
      return instance.addUser(accounts[1], 'Peter', 'Lai', 18);
    }).then(function () {
      return user.getUser.call(accounts[1]);
    }).then(function (userData) {
      assert.equal(userData[0], 'Peter', "User first name wasn't Peter.");
      assert.equal(userData[1], 'Lai', "User last name wasn't Lai.");
      assert.equal(userData[2], 18, "User age wasn't 18.");
      return AddUser.get();
    }).then(function (logs) {
      let log = logs[0];

      assert.equal(log.event, 'AddUser', "Event name wasn't AddUser.");
      assert.equal(log.args.ethAddress, accounts[1], "User address wasn't second address.");
      assert.equal(log.args.firstName, 'Peter', "User first name wasn't Peter.");
      assert.equal(log.args.lastName, 'Lai', "User last name wasn't Lai.");
      assert.equal(log.args.age, 18, "User age wasn't 18.");
    });
  });

  it("should get empty user", function () {
    let user;

    return User.deployed().then(function (instance) {
      user = instance;
      return user.getUser.call(accounts[0]);
    }).then(function (userData) {
      assert.equal(userData[0], '', "User first name wasn't empty.");
      assert.equal(userData[1], '', "User last name wasn't empty.");
      assert.equal(userData[2], 0, "User age wasn't 0.");
    });
  });

  it("shouldn't get other user if not owner", function () {
    let user;

    return User.deployed().then(function (instance) {
      user = instance;
      return instance.addUser(accounts[1], 'Peter', 'Lai', 18);
    }).then(function () {
      return user.addUser(accounts[2], 'Howard', 'Lai', 20);
    }).then(function () {
      return user.getUser.call(accounts[2], {from: accounts[1]});
    }).then(function (userData) {
      assert.equal(userData[0], '', "User first name wasn't empty.");
      assert.equal(userData[1], '', "User last name wasn't empty.");
      assert.equal(userData[2], 0, "User age wasn't 0.");
      return user.getUser.call(accounts[1], {from: accounts[1]});
    }).then(function (userData) {
      assert.equal(userData[0], 'Peter', "User first name wasn't Peter.");
      assert.equal(userData[1], 'Lai', "User last name wasn't Lai.");
      assert.equal(userData[2], 18, "User age wasn't 18.");
    });
  });
});
