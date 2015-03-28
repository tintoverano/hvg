Template.login.events ({
  'click #facebook-login': function (event) {
    Meteor.loginWithFacebook ({}, function (err){
      if (err) {
        throw new Meteor.Error ("Facebook login failed");
      }
    });
  },

  'click #logout': function (event) {
    Meteor.logout (function (err) {
      if (err) {
        throw new Meteor.Error ("Logout failed");
      }
    })
  }
});

Template.login.helpers ({
  currentUser: function () {
    var currentUser = Meteor.user ();
    return currentUser;
    //if(currentUser.services.google && currentUser.services.google.name)
      //return currentUser.services.google.name;
    /*else*/ if (currentUser.services.facebook && currentUser.services.facebook.name)
      return currentUser.services.facebook.name;
    else
      return currentUser.username;
  }
});