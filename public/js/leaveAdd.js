$(document).ready(function () {
  populateDate();
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
    //nextDay();
    console.log($('#fromDate').val());    
    $('#leaveDay').val(calculateDay());
    
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
  var dayDiff = (new Date(todate).getTime() - new Date(fromdate).getTime()) / (1000 * 3600 * 24);  
  return dayDiff+1;
}

var is_date = function (input) {
  if (Object.prototype.toString.call(input) === "[object Date]")
    return true;
  return false;
};