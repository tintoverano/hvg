Meteor.startup (function () {
  Places._ensureIndex ({'loc.coordinates':'2dsphere'});
});
