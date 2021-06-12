$(document).ready(function () {
  var now = getDate("today");
  var maxDate = getDate("maxdate") + "-" + "03" + "-" + "31";
  var date = new Date();
  var year = date.getFullYear();
  var mini = year + "-" + "04" + "-" + "01";
  $("#date").val(now);
  $("#date").attr("max", maxDate);
  $("#date").attr("min", mini);

  populateDate();

  $('#dataTableInputSearch').attr('placeholder', 'Search Record.....')

  if ($("#holidaytype").val() == "float") {
    $("#toDate").prop("disabled", true);
  }
  $('#tblHoliday').DataTable();

  $("#holiday_sadsa").keydown(function (e) {
    if (e.shiftKey || e.ctrlKey || e.altKey) {
      e.preventDefault();
    } else {
      var key = e.keyCode;
      if (!(
        key == 8 ||
        key == 32 ||
        key == 46 ||
        (key >= 35 && key <= 40) ||
        (key >= 65 && key <= 90)
      )) {
        e.preventDefault();
      }
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
    //nextDay();
    console.log($('#fromDate').val());
    $('#leaveDay').val(calculateDay());

  });

  $('#toDate').on('change', () => {
    var day = calculateDay();
    $('#leaveDay').val(day);
  });

  $('#btnreset').on('click', () => {
    populateDate();
  });

  // $('#btncancel').on('click',()=>{
  //   window.location.href = '/list'; 
  // });
  $('#button').on('click', e => {
    let amit = $('#amit')
    console.log(amit)
    let temp = `<div class="col card text-center">
              <div class="card-header">Bootstrap 4 card example</div>
               <div class="card-body">
               <div class="card-title">Hello World, this is PugHtml</div><i class="fa fa-home fa-2x text-primary"></i></div>
                <div class="card-footer text-muted">powered by Bibooki</div>
               </div>`
    $('#amit').after(temp)
    $('.col4').hide()
  })


});

function populateDate() {
  var today = getDate('today');
  var year = new getDate();

  console.log(today);
  $('#fromDate').val($('#fromDate').val() || today);
  $('#toDate').val($('#toDate').val() || today);
  $('#fromDate').attr('min');
  $('#toDate').attr('min', today);
  var maxdate = getDate('maxdate');
  $('#toDate').attr('max', maxdate + '-' + '03' + '-' + '31');
  $('#fromDate').attr('max', maxdate + '-' + '03' + '-' + '31');
  $('#leaveDay').val(calculateDay());
}

function myFunction() {
  if ($("#holidaytype").val() == "float") {
    $("#toDate").prop("readonly", true);
    $("#toDate").val($("#fromDate").val());
  } else if ($("#holidaytype").val() == "public") {
    $("#toDate").removeAttr("readonly");
  }
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
  console.log(day + ';..');

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

function calculateDay() {
  var fromdate = $('#fromDate').val();
  var todate = $('#toDate').val();
  var dayDiff = (new Date(todate).getTime() - new Date(fromdate).getTime()) / (1000 * 3600 * 24);
  return dayDiff + 1;
}

var is_date = function (input) {
  if (Object.prototype.toString.call(input) === "[object Date]")
    return true;
  return false;
};