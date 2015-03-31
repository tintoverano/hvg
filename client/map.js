Session.setDefault ("slider", 0);
//var markerClusterer = null;
markers = [];
myLocMarker = null;

function placeMe () {
  GoogleMaps.ready ('theMap', function (map) {
  //if (GoogleMaps.loaded ()) {
    if (myLocMarker)
      myLocMarker.setMap (null);
    myLocMarker = null;
    myLocMarker = new google.maps.Marker ({
      position: new google.maps.LatLng (myLoc.lat, myLoc.lng),
      map: map.instance
    });
  });
}

function showMarkers (aCategory) {
  GoogleMaps.ready ('theMap', function (map) {
    markers.forEach (function (marker) {
      if (aCategory == "" || marker.theCategory == aCategory)
        marker.theMarker.setMap (map.instance);
      else
        marker.theMarker.setMap (null);
    });
  });
}

Template.map.onCreated (function () {
  placeMe ();
});

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

  if (aroundMe) {
    var i = 0;
    var categoryExists = false;
    var theCategory = Session.get ("category");

    aroundMe.forEach (function (place) {

      var categoryStr = "";
      place.kategoria.split ("/").forEach (function (category) {
        categoryStr += category.toLowerCase () + " ";
      });

      //console.log(categoryStr);
      var mapIcon = _.findWhere (mapIcons, {category: categoryStr}).icon;

      var content = '<div style="font-weight: bold;margin-left:-10px">' +
        place.kedvezmeny +
        '</div><div><i class="' +
        mapIcon +
        '" style="color:blue"></i></div>';

      var marker = new MarkerWithLabel ({
        position: new google.maps.LatLng (place.loc.coordinates[1], place.loc.coordinates[0]),
        map: GoogleMaps.maps.theMap.instance,
        animation: google.maps.Animation.DROP,
        icon: ' ',
        labelContent: content,
        labelAnchor: new google.maps.Point(20, 40),
        labelClass: 'marker-label'

      });
/*
      var categories = "";
      place.kategoria.split ("/").forEach (function (category) {
        categories += "<br/>" + category.toLowerCase ();
      });

      content = '<div class="infowindow">' +
        '<span style="color:red;font-weight:bold;">' + place.kedvezmeny + '</span>' + categories +
        '</div>';
*/
      var infowindow = new google.maps.InfoWindow ({
        content: place.nev[0]
      });
      //infowindow.open (GoogleMaps.maps.theMap.instance, marker);
      //marker.infowindow = infowindow;

      google.maps.event.addListener (marker, "click", function (e) {
        infowindow.open (GoogleMaps.maps.theMap.instance, this);
      });

      aroundMe[i++].kategoria = categoryStr;

      markers.push ({theMarker: marker, theCategory: categoryStr});

      if (categoryStr == theCategory)
        categoryExists = true;
    });

    if (!categoryExists && markers.length != 0) {
      theCategory = "";
      Session.set ("category", "");
    }

    showMarkers (theCategory);
  }
  placeMe ();
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
      var slider = Session.get ("slider");
      Meteor.promise ("getCircle", Session.get ("myLoc"), slider * 0.3)
        .then (placeMarkers)
        .done (function () {autoCenter ();})
        .fail (function (err) {console.error ("Bad", err);})
    }
    return (Session.get ("slider") * 0.3).toFixed (1);
  }
});
