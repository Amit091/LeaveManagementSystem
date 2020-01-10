var LP = { 'casual': 4, 'sick': 0, 'mourn': 0, 'marriage': 7, 'paternity': 15, 'maternity': 15, 'unpaid': 0 };
var LA = { 'casual': 12, 'sick': 3, 'mourn': 13, 'marriage': 5, 'paternity': 5, 'maternity': 60, 'unpaid': 0 };
$(document).ready(function () {

 //$('#leaveType').attr('disabled',true);
  populateData();

  // var pat = $('#paternity');
  // var mat = $('#maternity');

  // if (pat.attr('selected') == 'selected') {
  //   pat.removeAttr('disabled');
  //   mat.attr('disabled', 'true');
  // } else if (mat.attr('selected') == 'selected') {
  //   console.log('thi too');
  //   mat.removeAttr('disabled');
  //   pat.attr('disabled', 'true');
  // } else {
  //   pat.attr('disabled', 'true');
  //   pat.attr('disabled', 'true');
  // }

  $('#fromDate').on('change', () => {
    $('#toDate').attr('min', $('#fromDate').val());
    $('#toDate').val($('#fromDate').val());
    // var day = calculateDay();
    // $('#leaveDay').val(day);
    // //nextDay();
    // console.log($('#fromDate').val());
    $('#leaveDay').val(calculateDay());
  });

  $('#toDate').on('change', function () {
    $('#leaveDay').val(calculateDay());
});   

  $('#btnreset').on('click', () => {
    // populateDate();
    $('#leaveapplyform').trigger('reset');
    populateData();
  });

  $('#leaveType').on('change', function () {
    //this == event.currentTarget;
    let type = $('#leaveType').val() + 'leave';
    leaveTypeAction($(this).val());
    $('#leaveDay').val(calculateDay());
  });
});

//leave type action
function leaveTypeAction(leave) {
  let dayBefore = LP[`${leave}`];  
  let ndate = calculateNextDay(dayBefore);
  $('#fromDate').val(ndate);
  $('#toDate').val(ndate);
  $('#fromDate').attr('min', ndate);
  $('#toDate').attr('min', ndate);
}

function populateData() {
  var today = getDate('today');
  $('#fromDate').val( ($('#fromDate').val() == '') ? today : $('#fromDate').val());
  $('#toDate').val( ($('#toDate').val() == '') ? today : $('#toDate').val());  
  $('#fromDate').attr('min', today);
  $('#toDate').attr('min', $('#fromDate').val() || today);  
  $('#toDate').attr('max', getDate('maxdate') + '-' + '03' + '-' + '31');
  $('#fromDate').attr('max', getDate('maxdate') + '-' + '03' + '-' + '31');
  $('#leaveDay').val(calculateDay());  
}

function getDate(status) {
  var now = new Date();
  var today = formatDate(now);
  // console.log(today);
  if (status === "today") return today;
  else if (status === "maxdate") {
    return (now.getMonth() + 1) < 4?  now.getFullYear() :now.getFullYear()+1;
  }
  else return today;
}

function nextDay(x) {
  var fdate = $('#fromDate').val();
  var day = $('#leaveDay').val();
  var newDate = new Date(fdate);
  day = (day !== '') ? parseInt(day) : 0;
  console.log(day + ';..');
  if (day != 0) {
    var now = (newDate) ? fdate : new Date();
    console.log(calculateNextDay(day));
    $('#toDate').val(calculateNextDay(day));
  } else if (day == 0) {
    $('#toDate').val(fdate);
  }
}

//calculate day diff between from date and to date
function calculateDay() {
  var fromdate = $('#fromDate').val();
  var todate = $('#toDate').val();
  var dayDiff = (new Date(todate).getTime() - new Date(fromdate).getTime()) / (1000 * 3600 * 24);
  return dayDiff + 1;
}

//calculate the next day by adding the params no.of day
function calculateNextDay(day) {
  var today = new Date();
  var dd = today.setDate(today.getDate() + day);
  return formatDate(today);
}

//format day in form pf  yyyy-mm-dd
function formatDate(day) {
  var uDate = new Date(day);
  var month = (uDate.getMonth() + 1);
  day = uDate.getDate();
  if (month < 10)
    month = "0" + month;
  if (day < 10)
    day = "0" + day;
  return uDate.getFullYear() + '-' + month + '-' + day;
}