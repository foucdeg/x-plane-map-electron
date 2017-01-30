import $ from 'jquery';
let config = require('electron').remote.require('./config');

$(document).ready(function() {
  $(window).bind('hashchange', changeTab);

  fillConfig()

  changeTab();
});

function changeTab() {
  const hash = document.location.hash.substring(1);
  $('section').hide();
  $(document).find('section[data-section-id="' + hash + '"]').show();

  $('nav a').removeClass('active');
  $('nav').find('a[href="#' + hash + '"]').addClass('active');
}

function fillConfig() {
  $(document).find('[data-bind]').each(function() {
    let configOption = $(this).attr('data-bind');
    $(this).text(config.getSync(configOption));
  });
  $(document).find('[data-bind-value]').each(function() {
    let configOption = $(this).attr('data-bind-value');
    $(this).val(config.getSync(configOption));
  });
}
