  $("#autoname").autocomplete({
    classes: {
    "ui-autocomplete": "highlight"
  },
      autoFocus: true,
      position: { my : "right top", at: "right bottom" },
    source: function (req, res) {
      $.ajax({
        type: `GET`,
        url: `/ajax/api/getuser`,
        data: { 'query': `${$('#autoname').val()}` },
        contentType: 'application/x-www-form-urlencoded',
        success: (result => {
          let arr = result.data;
          let data=[];
          arr.forEach(item => {
            data.push({'id':item.employee_id,'label':item.employee_name,'value':item.employee_name});
          });
          res(data);
        }),
        error: error => {
          console.log('its from error');
        }
      });
    },
      minLength : 3,
      select: function( event, ui ) {
        log( "Selected: " + ui.item.value + " aka " + ui.item.id );
        $('#autoname').attr('data-id',ui.item.id);
      }
  });

  function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }