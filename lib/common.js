Places = new Meteor.Collection ("places");

Push.allow ({
  send: function (userId, notification) {
    // Allow all users to send to everybody - For test only!
    return true;
  }
});