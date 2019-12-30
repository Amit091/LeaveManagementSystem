$("#autoname").autocomplete({
  classes: {
    "ui-autocomplete": "highlight"
  },
  autoFocus: true,
  position: { my: "right top", at: "right bottom" },
  source: function (req, res) {
    console.log($('#autoname').val());

    $.ajax({
      type: `GET`,
      url: `/ajax/api/getuser`,
      data: { 'query': `${$('#autoname').val()}` },
      contentType: 'application/x-www-form-urlencoded',
      success: (result => {
        let arr = result.data;
        let data = [];
        arr.forEach(item => {
          data.push({ 'id': item.id, 'label': item.name, 'value': item.name, 'gender': item.gender, 'jdate': item.fjoined });
        });
        res(data);
      }),
      error: error => {
        console.log('its from error');
      }
    });
  },
  minLength: 2,
  select: function (event, ui) {
    log("Selected: " + ui.item.value + " aka " + ui.item.id);
    $('#autoname').attr('data-id', ui.item.id).attr('data-gender', ui.item.gender).attr('data-jdate', ui.item.jdate);
    $('#userid').val(ui.item.id);
    $('#userdate').val(ui.item.jdate);
    $('#usergender').val(ui.item.gender);

    console.log('changed' + ui.item.jdate);
    let status = diff_months(new Date(ui.item.jdate), new Date());
    console.log(status);
    validLeaveType(ui.item.gender, status);
  }
});

function log(message) {
  $("<div>").text(message).prependTo("#log");
  $("#log").scrollTop(0);
}

function diff_months(jdate, nowdt) {  
  if (jdate.getFullYear() <= nowdt.getFullYear()) {
    var diff = (jdate.getTime() - nowdt.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    diff = Math.abs(diff);
    return (diff > 6) ? true : false;
  } else {
    return false;
  }
}