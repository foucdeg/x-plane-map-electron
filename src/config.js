import $ from 'jquery';

$(document).ready(function() {
  $(window).bind('hashchange', changeTab);

  changeTab();
});

function changeTab() {
  const hash = document.location.hash.substring(1);
  $('section').hide();
  $(document).find('section[data-section-id="' + hash + '"]').show();

  $('nav a').removeClass('active');
  $('nav').find('a[href="#' + hash + '"]').addClass('active');
}
