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
  {category: "könyv zenemű ", icon: "map-icon-book-store"},
  {category: "kert virág ", icon: "map-icon-florist"}
];

Session.setDefault ("category", "");

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
    if (aCategory == undefined || markers == [])
      return "";
    var mapIcon = _.findWhere (mapIcons, {category: aCategory});
    if (mapIcon == undefined)
      return "";
    return mapIcon.icon;
  },

  setId: function (aCategory) {
    if (aCategory == undefined || markers == [])
      return "";
    var mapIcon = _.findWhere (mapIcons, {category: aCategory});
    if (mapIcon == undefined)
      return "";
    var theCategory = Session.get ("category");
    return (theCategory != "" && theCategory == mapIcon.category) ? "selectedCategory" : "";
  }
});

Template.categories.events ({
  'click i': function (event) {
    event.preventDefault ();

    var newCategory = event.currentTarget.id != "selectedCategory";

    event.currentTarget.id = newCategory ? "selectedCategory" : "";

    var mapIcon = _.findWhere (mapIcons, {icon: event.currentTarget.className});

    markers.forEach( function (marker) {
      if (marker.theCategory == mapIcon.category || !newCategory)
        marker.theMarker.setMap (GoogleMaps.maps.theMap.instance);
      else
        marker.theMarker.setMap (null);
    });

    Session.set ("category", newCategory ? mapIcon.category : "");
  }
});
