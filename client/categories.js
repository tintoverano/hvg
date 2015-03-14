mapIcons = [
  {category: "irodatechnika irodaszer ", icon: "map-icon-school"},
  {category: "éttermek kávézók ", icon: "map-icon-restaurant"},
  {category: "oktatás ", icon: "map-icon-library"},
  {category: "borszaküzletek pincék ", icon: "map-icon-liquor-store"},
  {category: "hotelek panziók ", icon: "map-icon-lodging"},
  {category: "sport szabadidő ", icon: "map-icon-physiotherapist"},
  {category: "egészség ", icon: "map-icon-spa"},
  {category: "hvg-kedvezmények ", icon: "map-icon-bank"},
  {category: "utazás ", icon: "map-icon-travel-agency"},
  {category: "bútor lakberendezés ", icon: "map-icon-furniture-store"},
  {category: "könyv zenemű ", icon: "map-icon-book-store"}
];

Template.categories.helpers ({
  myCategories: function () {
    var categories = [];
    var aroundMe = Session.get ("aroundMe");
    if (aroundMe)
      aroundMe.forEach (function (place) {
        if (!_.contains (categories, place.kategoria))
          categories.push (place.kategoria);
      });
    return categories;
  },

  setIcon: function (aCategory) {
    if (aCategory == undefined)
      return "";
    var category = _.findWhere (mapIcons, {category: aCategory});
    return category.icon;
  }
});

Template.categories.events ({
  'click i': function (event) {
    event.preventDefault ();

    var mapIcon = _.findWhere (mapIcons, {icon: event.currentTarget.className});

    markers.forEach( function (marker) {
      if (marker.theCategory != mapIcon.category) {
        if (marker.show)
          marker.theMarker.setMap (null);
        else
          marker.theMarker.setMap (GoogleMaps.maps.theMap.instance);
        marker.show = !marker.show;
      }
    });
  }
});
