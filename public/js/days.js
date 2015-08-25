'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay;

  function addDay () {
    // days.push({
    //   hotels: [],
    //   restaurants: [],
    //   activities: []
    // });
    var numOfButtons = $(".day-buttons").children().length;
    console.log("numOfButtons: ", numOfButtons);
    $.ajax({
      method: 'post',
      url: "/api/days/",
      data: {num: numOfButtons},
      success: function (newDay) {
        console.log("new day: ", newDay);
        currentDay = newDay;
        renderDayButtons();
        switchDay(numOfButtons);
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to add day: ", errorObj);
      }
   });
  }

  function switchDay (index) {
    console.log("index is: ", index);
    var $title = $('#day-title');
    // if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index) + '</span>');
    //make asynch
    getDay(index, function () {
      console.log("current day is: ", currentDay);
      renderDay(currentDay);
      renderDayButtons();
    });
  }

  function getDay (index, cb) {
    //console.log("index in getDay: ", index);
    $.ajax({
      method: 'get',
      url: "/api/days/" + index,
      success: function (switchedDay) {
          console.log("active day: ", switchedDay.number);
          currentDay = switchedDay;
          cb();
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to switch day: ", errorObj);
      }
   });

  }

  function removeCurrentDay () {
    console.log("daynumtodelete: ",currentDay.number);
    var numToDelete = currentDay.number;
    var nextNumber = numToDelete - 1;
    //console.log("new active : ", currentDay.number);
    $.ajax({
      method: 'delete',
      url: '/api/days',
      data: {num: currentDay.number},
      success: function (responseData) {
          console.log("day deleted: ", responseData);
          if (nextNumber > 0) {
            //console.log("num to delete: ", numToDelete);
            switchDay(numToDelete);
          }
          else {
            //add new day 1
          }  
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to delete day: ", errorObj);
      }
   });
  }

  function renderDayButtons () {
    //console.log("rendering day buttons");
    var $daySelect = $('#day-select');
    $daySelect.empty();
    $.ajax({
      method: 'get',
      url: "/api/days",
      success: function (result) {
        //console.log("all days w nums: ", result);
        result.forEach(function(day, i){
          //console.log("day, i: ", day, i);
          $daySelect.append(daySelectHTML(day, i, day.number === currentDay.number));
        });
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to render buttons: ", errorObj);
      }
   });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    //console.log(day.number, currentDay.number, isCurrentDay);
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(id, type) {
    // if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    // currentDay[attraction.type].push(attraction);
    var day = currentDay.number;
    //console.log("type, daynum: ", type, day);
    $.ajax({
      method: 'get',
      url: "/api/days/attractions/" + type + "/" + id,
      success: function (attraction) {
        //console.log("TYPE: ", type);
        //console.log("attraction: ", attraction);
        $.ajax({
          method: 'post',
          url: "/api/days/" + day + "/" + type,
          data: attraction,
          success: function (postedDay) {
            $.ajax({
              method: 'get',
              url: "/api/days/" + postedDay.number,
              success: function (switchedDay) {
                  console.log("active day: ", switchedDay.number);
                  renderDay(switchedDay);
              },
              error: function (errorObj) {
                  // some code to run if the request errors out
                  console.error("unable to switch day: ", errorObj);
              }
            });
            // console.log("attractions for posted day: ", postedDay);
            // console.log("attractions for current day: ", currentDay);
          },
          error: function (errorObj) {
              // some code to run if the request errors out
              console.error("unable to add attraction: ", errorObj);
          }
        });
      },
      error: function (errorObj) {
          // some code to run if the request errors out
          console.error("unable to find attraction: ", errorObj);
      }
    });
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
    console.log("rendering day: ", day);
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      if (type === "hotel" || type === "restaurants" || type === "activities") {
        var daytype = day[type];
        daytype.forEach(function(attraction) {
          console.log("type: ", type);
          // console.log("day: ", day);
          console.log("list of attractions for type for this day: ", daytype);
          console.log("attraction name: ", attraction.name);
          //if (attraction.length > 0) {
            $list.append(itineraryHTML(attraction, type));
            mapModule.drawAttraction(attraction);
          //}
        });
      } 
    });
  }

  function itineraryHTML (attraction, type) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
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
