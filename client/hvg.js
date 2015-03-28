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

Template.nav.events ({
  'click .navbar li a': function (e) {
    var navbar = $('.navbar-toggle');
    if (navbar && typeof (navbar) !== 'undefined') {
      navbar.click();
    }
  }
});

Template.layout.helpers ({
  loadMarkerLabel: function () {
    if (GoogleMaps.loaded ())
      IRLibLoader.load (
        "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel.js",
        {
          success: function () {
            var slider = Session.get("slider");
            if (slider === 1)
              slider = 0;
            Session.set ("slider", slider);
          },

          error: function () {
            console.log ('ERROR CALLBACK');
          }
        }
      );
  },

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