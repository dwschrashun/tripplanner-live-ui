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
		console.log("all days w nums: ", result);
		res.json(result);
	}).then(null, function (error) {		
		next();
		res.send(error);
	});
});

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

router.get("/:id", function (req, res) {
	console.log("hit router for id: ", req.params.id);
	Day.find({number: req.params.id}).exec().then(function (result) {
		console.log("id search result: ", result);
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

router.delete("/", function (req, res) {
	//console.log(req.body);
	Day.findOne({number: req.body.num}).exec().
	then(function (searchResult) {
		console.log("page to remove: ", searchResult);
		searchResult.remove();}).
	then(function (result) {
		console.log("deleted: ", result);
		res.json("success");}).
	then(null, function(err) {
		console.error("deletion error: ", err);
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


