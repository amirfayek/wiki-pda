var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Promise = require("bluebird");

var request = Promise.promisifyAll(require("request"), {
    multiArgs: true
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('places-form', {});
});


router.post('/', function(req, res, next) {
    var redirectUrl = '/places/' + req.body.inputName;
    res.redirect(redirectUrl);
});


router.get('/:name', function(req, res, next) {
    var place = {
        name: req.params.name
    };

    var bingNewsOptions = {
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=' + req.params.name + '&count=10&offset=0&mkt=en-us&safeSearch=Moderate',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.BING_KEY
        }
    };

    var bingImageOptions = {
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + req.params.name + '&count=10&offset=0&mkt=en-us&safeSearch=Moderate',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.BING_KEY
        }
    };

    request.getAsync(bingNewsOptions).spread(function(response, body) {
        var info = JSON.parse(body);
        _.extend(place, {
            news: info
        });
        return request.getAsync(bingImageOptions);
    }).spread(function(response, body) {
        var info = JSON.parse(body);
        _.extend(place, {
            images: info
        });
        res.render('places', place);
    }).catch(function(err) {
        // error here
        console.log(err);
    });
});


module.exports = router;