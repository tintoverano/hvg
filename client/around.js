Template.around.helpers ({
  myPlaces: function () {
    var category = Session.get ("category");
    var places = Session.get ("aroundMe");

    if (category == "")
      return places;

    var myPlaces = [];

    places.forEach (function (place) {
      if (place.kategoria == category)
        myPlaces.push (place);
    });

    return myPlaces;
  }
});

Template.around.helpers ({
  setIcon: function (aCategory) {
    if (aCategory == undefined || markers == [])
      return "";
    var category = _.findWhere (mapIcons, {category: aCategory});
    if (category == undefined)
      return "";
    return category.icon;
  }
});
