$(document).ready(function () {
  $('.navbar-burger').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('is-active');
    $('.navbar-menu').toggleClass('is-active');
  });
});