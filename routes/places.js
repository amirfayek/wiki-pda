var express = require('express');
var router = express.Router();

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var request = require('request');
var rp = require('request-promise');
var _ = require('underscore');


/* GET home page. */
router.get('/', function(req, res, next) {  
  //   var enriched_text = {};
  //   enriched_text.entities = {};

  // // watson config
  // var discovery = new DiscoveryV1({
  //   username: '495b42a9-c5ef-4d96-a95f-b67df49c6284',
  //   password: 'rJpkRmmyDXGG',
  //   version_date: DiscoveryV1.VERSION_DATE_2016_12_15
  // });

  // discovery.query({
  //     environment_id: 'db230d72-27d8-429a-b78f-059fbca84041',
  //     collection_id: '21a7e4a0-d9b2-4f0d-91ba-0ff26815e6b6'
  //   }, function(err, response) {
  //         if (err) {
  //           console.error(err);
  //         } else {
  //           console.log(JSON.stringify(response, null, 2));
  //         }
  //    });
  res.render('places-form', {});
});

router.post('/', function(req, res, next) {  
    var redirectUrl = '/places/' + req.body.inputName
    console.log(redirectUrl);
    res.redirect(redirectUrl);
});

router.get('/:name', function(req, res, next) {  
  var place = { name: req.params.name };

  var bingOptions = {
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=' + req.params.name + '&count=10&offset=0&mkt=en-us&safeSearch=Moderate',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_KEY
    }
}

rp(bingOptions).then(function(data) {
    var info = JSON.parse(data);
    _.extend(place, {news: info});
}).then(function() {
    console.log(place);
    res.render('places', place);
})
});

module.exports = router;