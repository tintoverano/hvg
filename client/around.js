Template.around.helpers ({
  myPlaces: function () {
    return Session.get ("aroundMe");
  }
});

Template.around.helpers ({
  setIcon: function (aCategory) {
    if (aCategory == undefined)
      return "";
    var category = _.findWhere (mapIcons, {category: aCategory});
    return category.icon;
  }
});
