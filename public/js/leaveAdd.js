$(document).ready(function () {
  populateDate();
  $('#leaveDay').on('keyup', () => {
    var day = $('#leaveDay').val();
    
    console.log(day);
    day = (day == "") ? 0 : parseInt(day);

    console.log(day);
    console.log(typeof day);
    if (day >= 0 && typeof day == "number" && day < 100) {
      day = (typeof day == 'number' && day >= 0) ? day : 0;
      $('#leaveinfo').attr('color', 'red');
      $('#leaveinfo').html('');
      nextDay();
    } else if (day > 100 && typeof day == "number") {
      console.log('11');
      $('#leaveinfo').html('Invalid value! must be below 100 Days');
    } else if (day < 0 || day == 'NaN') {
      console.log('Invalid leave day');
      $('#leaveinfo').html('Invalid value! Must be +ve Number');
      console.log('12j');
    } else if (day == "" || day == 'NaN') {
      console.log('herer');
      $('#leaveinfo').html('');
    }
  });

  $('#doneCheck').click(function () {
    console.log('check this out');
    if ($('#doneCheck').is(":checked")) {
      $('#btnSubmit').prop('disabled', false);
    } else {
      $('#btnSubmit').prop('disabled', true);
    }
  });

  $('#fromDate').on('change', () => {
    $('#toDate').attr('min', $('#fromDate').val());
    $('#toDate').val($('#fromDate').val());
    var day = calculateDay();
    $('#leaveDay').val(day);
    nextDay();
    console.log($('#fromDate').val());    
    
  });

  $('#toDate').on('change', () => {
    var day = calculateDay();
    $('#leaveDay').val(day);

  });

  function populateDate() {
    var today = getDate('today');
    console.log(today);
    $('#fromDate').val(today);
    $('#toDate').val(today);
    $('#fromDate').attr('min', today);
    $('#toDate').attr('min', today);
    var maxdate = getDate('maxdate');
    $('#toDate').attr('max', maxdate + '-' + '03' + '-' + '31');
    $('#fromDate').attr('max', maxdate + '-' + '03' + '-' + '31');
  }

  function getDate(status) {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
      month = "0" + month;
    if (day < 10)
      day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    if (status === "today") return today;
    else if (status === "maxdate") return now.getFullYear() + 1;
    else return today;
  }

  function nextDay() {
    var fdate = $('#fromDate').val();
    var day = $('#leaveDay').val();
    var newDate = new Date(fdate);
    day = (day !== '') ? parseInt(day) : 0;
    console.log(day+';..');
    
    if (day != 0) {
      var now = (newDate) ? fdate : new Date();
      newDate.setDate(newDate.getDate() + day);
      var month = (newDate.getMonth() + 1);
      day = newDate.getDate();
      if (month < 10)
        month = "0" + month;
      if (day < 10)
        day = "0" + day;
      var nextDate = newDate.getFullYear() + '-' + month + '-' + day;
      $('#toDate').val(nextDate);
    } else if (day == 0) {
      $('#toDate').val(fdate);
    }
  }
});

function calculateDay() {
  var fromdate = $('#fromDate').val();
  var todate = $('#toDate').val();
  console.log((new Date(todate).getTime() - new Date(fromdate).getTime()) / (1000 * 3600 * 24));
  var dayDiff = (new Date(todate).getTime() - new Date(fromdate).getTime()) / (1000 * 3600 * 24);
  return dayDiff;
  //$('#toDate').val(fromdate);
  
}

var is_date = function (input) {
  if (Object.prototype.toString.call(input) === "[object Date]")
    return true;
  return false;
};