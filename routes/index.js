var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
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
  console.log("hit router");
  Day.find({number: 1}).exec().then(function (result) {
    console.log("result: ", result);
    if (result.length < 1) {
      console.log("day result: ", result);
      return Day.create({number: 1});
    }
    else {
      return response.json(result[0]);
    }
  }).then(function (newDay) {
    console.log("returning new day");
    return response.json(newDay);
  }).then(null, function (error) {
    console.error("this is error: ", error);
    next();
  });
})

router.use("/api/days", days);

module.exports = router;
