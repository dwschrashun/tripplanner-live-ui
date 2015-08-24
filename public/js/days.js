'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay = days[0];

  function addDay () {
    // days.push({
    //   hotels: [],
    //   restaurants: [],
    //   activities: []
    // });
    
    renderDayButtons();
    switchDay(currentDay.number + 1);
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = getDay(index);
    console.log("current day is: ", currentDay);
    renderDay(currentDay);
    renderDayButtons();
  }

  function getDay (index) {
    var theUrl = "/api/days/" + index;
    $.ajax({
      method: 'get',
      url: theUrl,
      success: function (responseData) {
          console.log("active day: ", responseData);
          return responseData;
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to switch day: ", errorObj);
      }
   });

  }

  function removeCurrentDay () {
    $.ajax({
      method: 'delete',
      url: '/api/days',
      success: function (responseData) {
          console.log("day deleted: ", responseData);
          switchDay(index);
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to delete day: ", errorObj);
      }
   });

    // $.delete('/api/days', function (data) {console.log('deleted day: ', data)})
    // .fail( function (err) {console.error('err', err)} );

    // if (days.length === 1) return;
    // var index = days.indexOf(currentDay);
    // days.splice(index, 1);
    // switchDay(index);
  }

  function renderDayButtons () {
    console.log("rendering day buttons");
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);
    renderDay(currentDay);
  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    console.log("the day: ", day);
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    switchDay(1);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
