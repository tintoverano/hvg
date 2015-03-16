
Push.debug = false;

Meteor.startup (function () {
  myLoc = {"lat": 0, "lng": 0};
  Session.setDefault ("myLoc", myLoc);
});

Template.navItems.helpers ({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current ();
    return currentRoute && template === currentRoute.lookupTemplate () ? 'active' : '';
  }
});

Template.layout.helpers ({
  updateLoc: function () {
    var curLoc = Geolocation.latLng ();
    if (curLoc) {
      var roundedCurLoc = {"lat": curLoc.lat.round (5), "lng": curLoc.lng.round (5)};
      if (JSON.stringify (myLoc) !== JSON.stringify (roundedCurLoc)) {
        myLoc = roundedCurLoc;
      }
    }
  }
});