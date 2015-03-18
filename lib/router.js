var subs = new SubsManager ({
    cacheLimit: 2,
    expireIn: 5
});

Router.configure ({
  layoutTemplate: 'layout'
});

Router.route ('map',  {
  loadingTemplate: 'loadingMap',

  path: '/',

  waitOn: function () {
    return [
      subs.subscribe ("places")
    ];
  },

  data: function () {},

  action: function () {
    this.render ('map');
  }
});

Router.route ('around',  {
  waitOn: function () {},

  data: function () {},

  action: function () {
    this.render ('around');
  }
});

Router.route ('about',  {
  action: function () {
    this.render ('about');
  }
});

Router.onBeforeAction (function ()
  {
    GoogleMaps.load ({ v: '3', key: Meteor.settings.public.googleMapsApiKey});
    this.next ();
  },

  {
    only: ['map']
  }
);

/*IRLibLoader.load ('http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.8/src/markerwithlabel.js');
 IRLibLoader.load (
 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js',
 {
 success: function () {console.log ('SUCCESS CALLBACK');},
 error: function () {console.log ('ERROR CALLBACK');}
 }
 );*/
