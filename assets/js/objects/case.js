$(function() {
  window.Case.initialize();
});

window.Case = {
  initialize: function() {
  },

  display: function display(){
    Case.load();
    $('.transactions-h1').html('Cases');
    $('.transactions-purchases, .transactions-sales').hide();
    $('.transactions .transactions-cases').show();
  },

  load: function load(){
    $('.transactions .transactions-purchases tbody').empty();

    _.each(cases, function(c){ 
      $('.transactions .transactions-cases tbody').append('<tr class="transaction-detail" data-id="' + c['id'] + '" data-transaction-type="case"><td>' + c['id'] + '</td><td>' + c['date'] + '</td><td><div class="avatar position-float-left" style="background: url(' + c['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['buyer-handle'] + '</div></td><td><div class="avatar position-float-left" style="background: url(' + c['vendor-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['vendor'] + '</div></td><td>' + c['status'] + '</td></tr>');
    });
  },
} 