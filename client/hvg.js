Session.setDefault ("slider", 2);
//var markerClusterer = null;
markers = [];
myLocMarker = null;
myLoc = {"lat": 0, "lng": 0};
Session.setDefault ("myLoc", myLoc);

Push.debug = false;

Meteor.startup (function () {
  //GoogleMaps.load ({key: Meteor.settings.public.googleMapsApiKey});
});

Template.navItems.helpers ({
  activeIfTemplateIs: function (template) {
    var currentRoute = Router.current ();
    return currentRoute && template === currentRoute.lookupTemplate () ? 'active' : '';
  }
});

function placeMe () {
  if (GoogleMaps.loaded ()) {
    if (myLocMarker == null) {
      myLocMarker = new google.maps.Marker ({
        position: new google.maps.LatLng (Session.get ("myLoc").lat, Session.get ("myLoc").lng),
        map: GoogleMaps.maps.theMap.instance
      });
      //console.log ("placeMe init: " + myLocMarker);
    }
    else {
      //console.log ("placeMe update");
      myLocMarker.setPosition (myLoc);
    }
  };
};

Template.map.created = function () {
  placeMe ();
};

Template.map.rendered = function () {
  this.$ ("#slider").noUiSlider ({
    start: 2,
    connect: "lower",
    step: 1,
    handles: 1,
    range: {
      'min': 0,
      'max': 10
    },
    format: wNumb ({
      decimals: 0
    })
  }).on ('change', function (event, value) {
    Session.set ("slider", value);
  });
};

function placeMarkers (aroundMe) {
  Session.set ("aroundMe", aroundMe);

  if (markers) {
    markers.forEach (function (marker) {
      marker.setMap (null);
    });
  }
  markers = [];

  placeMe ();

  if (aroundMe) {
    aroundMe.forEach (function (place) {
      var marker = new google.maps.Marker ({
        position: new google.maps.LatLng (place.loc.coordinates[1], place.loc.coordinates[0]),
        map: GoogleMaps.maps.theMap.instance,
        animation: google.maps.Animation.DROP,
        icon: new google.maps.MarkerImage ("http://maps.google.com/mapfiles/ms/icons/blue.png")
      });

      var infowindow = new google.maps.InfoWindow ({
        content: place.kedvezmeny + " - " + place.nev[0],
        maxWidth: 90
      });
      infowindow.open (GoogleMaps.maps.theMap.instance, marker);

      markers.push (marker);
    });
  }
  return aroundMe;
};

function getCircle (aLoc, aSlider) {
  return Meteor.promise ("getCircle", aLoc, aSlider);
};

function autoCenter () {
  var bounds = new google.maps.LatLngBounds ();
  bounds.extend (new google.maps.LatLng (myLoc.lat, myLoc.lng));
  markers.forEach (function (marker) {
    bounds.extend (marker.position);
  });
  GoogleMaps.maps.theMap.instance.fitBounds (bounds);
};

Number.prototype.round = function (places) {
  return +(Math.round (this + "e+" + places)  + "e-" + places);
};

Template.map.helpers ({
  theMapOptions: function () {
    if (GoogleMaps.loaded ()) {
      //console.log("mapOptions");
      return {
        center: new google.maps.LatLng (Session.get ("myLoc").lat, Session.get ("myLoc").lng),
        zoom: 15
      };
    }
  },

  aroundMe: function () {
    Session.set ("myLoc", myLoc);
    //console.log("aroundMe");
    if (GoogleMaps.loaded ()) {
      Meteor.promise ("getCircle", Session.get ("myLoc"), Session.get ("slider") * 0.3)
        .then (placeMarkers)
        .done (function (aroundMe) {autoCenter ();})
        .fail (function (err) {console.error ("Bad", err);})
    }
    return (Session.get ("slider") * 0.3).toFixed (1);
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
    //console.log("updateLoc" + myLoc);
  }
});