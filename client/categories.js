Template.categories.helpers ({
  myCategories: function () {
    var categories = [];
    Session.get ("aroundMe").forEach (function (place) {
      if (!_.contains (categories, place.kategoria))
        categories.push (place.kategoria);
    });
    return categories;
  }
});
