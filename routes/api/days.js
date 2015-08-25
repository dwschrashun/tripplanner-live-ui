var express = require('express');
var router = express.Router();
var models = require('../../models/');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get("/", function (req, res) {
	Day.find({number: {$ne: null}}).exec().then(function (result) {
		//console.log("all days w nums: ", result);
		res.json(result);
	}).then(null, function (error) {	
		res.send(error);
		next();
	});
});

//new day
router.post("/", function (req, res) {
	console.log("hit post: ", req.body.num);
	Day.create({number: req.body.num}).then(function (result){
		console.log("added: ", result);
		res.status(201);
		res.json(result);
	}).then(null, function (error) {
		console.error("here's an error: ", error);
		next();
	});
});


//get day
router.get("/:id", function (req, res) {
	console.log("hit router for id: ", req.params.id);
	Day.findOne({number: req.params.id}).populate("hotel restaurants activities").exec().then(function (result) {
		console.log("day itinerary: ", result);
		return res.json(result);
	// }).then (fu)
	// 	console.log("id search result: ", result[0]);
	// 	res.json(result[0]);
	}).then(null, function (error) {
		console.error("search error: ", error);
		res.send(error);
	});
});

//delete day
router.delete("/", function (req, res) {
	console.log("request body: ", req.body);
	Day.findOne({number: req.body.num}).exec().
	then(function (searchResult) {
		console.log("page to remove: ", searchResult);
		searchResult.remove();}).
	then(function (result) {
		// console.log("deleted: ", result);
		Day.find({number: {$gt: req.body.num}}).
	then(function (searchResults) { 
		console.log("days to move: ", searchResults);
		searchResults.forEach(function (current){
			current.number--;
			current.save();
		});
		res.json(searchResults);});}).
	then(null, function(err) {
		console.error("deletion error: ", err);
		next();
	});
});


//new attraction
router.post("/:day/:type", function (req, res, next) {
	var attractionType = req.params.type;
	var attraction = req.body;
	//console.log("attraction: ", attraction);
	var day = req.params.day;
	//console.log("posting attractions");
	Day.findOne({number: day}).
		then(function(dayResult) {
		if (attractionType === "hotels") {
			dayResult.hotel = attraction;
			dayResult.save().
			then(function(saveResult) {
				return res.json(saveResult);
			}).
			then(null, function (error) {
				console.error("new attraction error: ", error);
				next();
			});
		} else if (attractionType === "restaurants") {
			dayResult.restaurants.push(attraction);
			dayResult.save().
			// then(function(day) {
			// 	console.log("type: ", attractionType);
			// 	return Day.findOne({number: day.number}).populate("restaurants").exec();
			// }).
			then(function(saveResult) {
				return res.json(saveResult);
			}).
			then(null, function (error) {
				console.error("new attraction error: ", error);
				next();
			});
		} else if (attractionType === "activities") {
			dayResult.activities.push(attraction);
			dayResult.save().
			// then(function(day) {
			// 	console.log("type: ", attractionType);
			// 	return Day.findOne({number: day.number}).populate("activities").exec();
			// }).
			then(function(saveResult) {
				return res.json(saveResult);
			}).
			then(null, function (error) {
				console.error("new attraction error: ", error);
				next();
			});
		}
	});
});

//get attraction object / populate
router.get("/attractions/hotels/:id", function (req, res) {
	Hotel.findOne({_id: req.params.id}).
		then(function(attractionResult) {
			console.log("attraction found: ", attractionResult);
			res.json(attractionResult);
		}).
		then(null, function (error) {
			console.error("Error on attraction search: ", error);
			next();
		});
});

router.get("/attractions/restaurants/:id", function (req, res) {
	Restaurant.findOne({_id: req.params.id}).
		then(function(attractionResult) {
			console.log("attraction found: ", attractionResult);
			res.json(attractionResult);
		}).
		then(null, function (error) {
			console.error("Error on attraction search: ", error);
			next();
		});
});

router.get("/attractions/activities/:id", function (req, res) {
	Activity.findOne({_id: req.params.id}).
		then(function(attractionResult) {
			console.log("attraction found: ", attractionResult);
			res.json(attractionResult);
		}).
		then(null, function (error) {
			console.error("Error on attraction search: ", error);
			next();
		});
});


// router.get("/:id/hotel", function (request, response) {
// 	Day.find({_id: request.params.day}).exec().then(function (result) {
// 		res.json(result);
// 	}).catch(function (error) {
// 		res.send(error);
// 	});
// });

// router.get("/:id/restaurants", function (request, response) {
// 	Day.find({_id: request.params.day}).exec().then(function (result) {
// 		res.json(result);
// 	}).catch(function (error) {
// 		res.send(error);
// 	});
// });

// router.get("/:id/activities", function (request, response) {
// 	Day.find({_id: request.params.day}).exec().then(function (result) {
// 		res.json(result);
// 	}).catch(function (error) {
// 		res.send(error);
// 	});
// });





// router.delete("/:id/hotel", function (request, response) {
	
// });

// router.delete("/:id/restaurants", function (request, response) {
	
// });

// router.delete("/:id/activities", function (request, response) {
	
// });

module.exports = router;


