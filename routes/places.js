var express = require('express');
var router = express.Router();

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var rp = require('request-promise');
var _ = require('underscore');
var Promise = require("bluebird");

// var request = require('request');
var request = Promise.promisifyAll(require("request"), {multiArgs: true});



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
    var redirectUrl = '/places/' + req.body.inputName;
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

  var bingImageOptions = {
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + req.params.name + '&count=10&offset=0&mkt=en-us&safeSearch=Moderate',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_KEY
    }
}

// rp(bingOptions).then(function(data) {
//     var info = JSON.parse(data);
//     _.extend(place, {news: info});
// }).then(function() {
//     res.render('places', place);
// })

request.getAsync(bingOptions).spread(function(response, body) {
    var info = JSON.parse(body);
    _.extend(place, {news: info});
    return request.getAsync(bingImageOptions);
}).spread(function(response, body) {
    var info = JSON.parse(body);
    console.log(info.value)
    _.extend(place, {images: info});
    console.log(place);
    res.render('places', place);

}).catch(function(err) {
    // error here
    console.log(err);

});
});



module.exports = router;