Session.setDefault ("slider", 1);
//var markerClusterer = null;
markers = [];
myLocMarker = null;


function placeMe () {
  if (GoogleMaps.loaded ()) {
    if (myLocMarker)
      myLocMarker.setMap (null);
    myLocMarker = null;
    myLocMarker = new google.maps.Marker ({
      position: new google.maps.LatLng (myLoc.lat, myLoc.lng),
      map: GoogleMaps.maps.theMap.instance
    });
  }
}

Template.map.created = function () {
  placeMe ();
};

Template.map.rendered = function () {
  this.$ ("#slider").noUiSlider ({
    start: Session.get ("slider"),
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
  if (markers) {
    markers.forEach (function (marker) {
      marker.theMarker.setMap (null);
    });
  }
  markers = [];

  placeMe ();

  if (aroundMe) {
    var i = 0;
    var categoryExists = false;
    var theCategory = Session.get ("category");

    aroundMe.forEach (function (place) {
      var marker = new google.maps.Marker ({
        position: new google.maps.LatLng (place.loc.coordinates[1], place.loc.coordinates[0]),
        map: GoogleMaps.maps.theMap.instance,
        animation: google.maps.Animation.DROP,
        icon: new google.maps.MarkerImage ("http://maps.google.com/mapfiles/ms/icons/blue.png")
      });

      var categories = "";
      place.kategoria.split ("/").forEach (function (category) {
        categories += "<br/>" + category.toLowerCase ();
      });

      var content = '<div class="infowindow">' +
        '<span style="color:red;font-weight:bold;">' + place.kedvezmeny + '</span>' + categories +
        '</div>';

      var infowindow = new google.maps.InfoWindow ({
        content: content
      });
      infowindow.open (GoogleMaps.maps.theMap.instance, marker);

      var categoryStr = "";
      place.kategoria.split ("/").forEach (function (category) {
        categoryStr += category.toLowerCase () + " ";
      });

      aroundMe[i++].kategoria = categoryStr;

      var fullMarker = {theMarker: marker, theCategory: categoryStr};

      markers.push (fullMarker);

      if (categoryStr == theCategory)
        categoryExists = true;
    });

    if (!categoryExists && markers.length != 0) {
      theCategory = "";
      Session.set ("category", "");
    }

    markers.forEach (function (marker) {
      if (theCategory == "" || marker.theCategory == theCategory)
        marker.theMarker.setMap (GoogleMaps.maps.theMap.instance);
      else
        marker.theMarker.setMap (null);
    });
  }
  Session.set ("aroundMe", aroundMe);
  return aroundMe;
}

function getCircle (aLoc, aSlider) {
  return Meteor.promise ("getCircle", aLoc, aSlider);
}

function autoCenter () {
  var bounds = new google.maps.LatLngBounds ();
  bounds.extend (new google.maps.LatLng (myLoc.lat, myLoc.lng));
  markers.forEach (function (marker) {
    bounds.extend (marker.theMarker.position);
  });
  GoogleMaps.maps.theMap.instance.fitBounds (bounds);
}

Number.prototype.round = function (places) {
  return +(Math.round (this + "e+" + places)  + "e-" + places);
};

Template.map.helpers ({
  theMapOptions: function () {
    if (GoogleMaps.loaded ()) {
      return {
        center: new google.maps.LatLng (Session.get ("myLoc").lat, Session.get ("myLoc").lng),
        zoom: 15
      };
    }
  },

  aroundMe: function () {
    Session.set ("myLoc", myLoc);
    if (GoogleMaps.loaded ()) {
      Meteor.promise ("getCircle", Session.get ("myLoc"), Session.get ("slider") * 0.3)
        .then (placeMarkers)
        .done (function (aroundMe) {autoCenter ();})
        .fail (function (err) {console.error ("Bad", err);})
    }
    return (Session.get ("slider") * 0.3).toFixed (1);
  }
});
