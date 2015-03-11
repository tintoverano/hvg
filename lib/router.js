Router.configure ({
  layoutTemplate: 'layout'  //can be any template name
});

Router.route ('map',  {
  loadingTemplate: 'loadingMap',

  path: '/',

  waitOn: function () {
    return [
      Meteor.subscribe ("places"),
    ];
  },

  data: function () {},

  action: function () {
    this.render ('map');
  }
});

Router.route ('around',  {
  //loadingTemplate: 'loadingJobs',

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

Router.onBeforeAction (function () {
  GoogleMaps.load ({key: Meteor.settings.public.googleMapsApiKey});
  this.next ();
}, {only: ['map']});

/*IRLibLoader.load ('http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.8/src/markerwithlabel.js');
 IRLibLoader.load (
 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js',
 {
 success: function () {console.log ('SUCCESS CALLBACK');},
 error: function () {console.log ('ERROR CALLBACK');}
 }
 );*/
