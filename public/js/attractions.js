'use strict';
/* global $ daysModule all_hotels all_restaurants all_activities */

$(document).ready(function() {

  var attractionsByType = {
    hotels:      all_hotels,
    restaurants: all_restaurants,
    activities:  all_activities
  };
  var attractionsByType;

  function findByTypeAndId (type, id) {
    // var attractions = attractionsByType[type],
    $.ajax({
      method: 'get',
      url: "/api/days/attractions/" + type + "/" + id,
      success: function (attraction) {
        console.log("TYPE: ", type);
        console.log("attraction: ", attraction);
        // attractions.some(function(attraction){
        //   if (attraction._id === id) {
        //     selected = attraction;
        //     selected.type = type;
        //     console.log ("in if selected: ", selected);
        //     return true;
        //   }
        // });
        // console.log ("out of if selected: ", selected);
        return attraction;
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to find attraction: ", errorObj);
      }
    });
  }
  $('#attraction-select').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        attractions = attractionsByType[type],
        id = $button.siblings('select').val();
    daysModule.addAttraction(id, type);
  });

  $('#itinerary').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        id = $button.data('id');
    daysModule.removeAttraction(findByTypeAndId(type, id));
  });

});
