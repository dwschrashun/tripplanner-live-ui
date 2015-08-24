var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
var bodyParser = require("body-parser");
var days = require("./api/days");

router.use(bodyParser.json());

router.get('/', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find()
    ]).spread(function(hotels, restaurants, activities) {
      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities
      });
    })
})

router.use("/api/days", days);

module.exports = router;
