var express = require('express');
var router = express.Router();
var models = require('../../models/');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get("/", function (request, response) {
	console.log("hit router");
	Day.find().exec().then(function (result) {
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
});

router.post("/", function (req, res) {
	Day.create(req.body).then(function(result) {
		console.log("added: ", result);
		res.status(201);
		res.json(result);
	}).then(null, function (error) {
		console.error("here's an error: ", error);
		next();
	});
});

router.get("/:id", function (req, res) {
	Day.find({number: req.params.id}).exec().then(function (result) {
		res.json(result);
	}).then(null, function (error) {
		res.send(error);
	});
});

router.post("/:id/", function (req, res) {
	Day.create(req.body).then(function(result) {
		res.status(201);
		res.json(result);
	});
});

router.delete("/:id", function (request, response) {
	console.log(request.body);
	// request.body.Day.remove();
	// Day.find({_id: request.params.id}).exec().then(function (result) {
	// 	result.remove();
	// });
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



// router.post("/:id/hotel", function (request, response) {
	
// });

// router.post("/:id/restaurants", function (request, response) {
	
// });

// router.post("/:id/activities", function (request, response) {
	
// });



// router.delete("/:id/hotel", function (request, response) {
	
// });

// router.delete("/:id/restaurants", function (request, response) {
	
// });

// router.delete("/:id/activities", function (request, response) {
	
// });

module.exports = router;


