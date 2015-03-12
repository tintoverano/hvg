Meteor.methods ({
  getCircle: function (aLoc, aRadius) {
    return Places.find ({loc: {$geoWithin: {$centerSphere: [[aLoc.lng, aLoc.lat], aRadius/6378.137]}}}).fetch ();
  }
});
/*
Meteor.startup (function () {
  if (Places.find ().count () === 0) {
    var url = "http://solr2.hvgklubkartya.hu/select?q=*%3A*&" +
        //"sort=nev%20asc&" +
      "start=0&facet=false&" +
      "facet.limit=3000&" +
      "facet.mincount=1&" +
      "rows=2000&" +
      "json.nl=map&" +
      "wt=json";
    Meteor.http.get (url, function (error, result) {
      if (!error) {
        var places = JSON.parse (result.content).response.docs;
        places.forEach (function (hvgItem) {
          var item = {
            "id": hvgItem.id,
            "kategoria": hvgItem.kategoria,
            "nev": hvgItem.nev,
            "kedvezmeny": hvgItem.kedvezmeny,
            "varos": hvgItem.varos,
            "cim": hvgItem.cim,
            "loc": {
              "type": "Point",
              "coordinates": [
                hvgItem.lng,
                hvgItem.lat
              ]
            }
          };
          if (hvgItem.lng != undefined)
            Places.insert (item);
        });
      }
      else
        console.log (error);
    });
  }
});
*/