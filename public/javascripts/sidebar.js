$(document).ready(function () {
  $('li.nav-item a.nav-link').on('click', function (e) {
    alert('yeah')
    $(this).closest('li.nav-item').addClass('active')
  });
})