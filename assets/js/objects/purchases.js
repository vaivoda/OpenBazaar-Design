$(function() {
  window.Purchases.initialize();
});

window.Purchases = {
  initialize: function() {
  },

  display: function display(){
    Purchases.load();
    $('.transactions-h1').html('Purchases');
    $('.transactions-purchases, .transactions-cases').hide();
    $('.transactions .transactions-orders').show();
  },

  load: function load(){
    $('.transactions .transactions-purchases tbody').empty();

    _.each(purchases, function(purchase){ 
      $('.transactions .transactions-purchases tbody').append('<tr class="transaction-detail" data-id="' + purchase['id'] + '" data-transaction-type="purchase"><td><div class="avatar purchase-item position-float-left" style="background: url(' + purchase['item-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-item position-margin-top-15px position-margin-left-8px">' + purchase['item-name'] + '</div></td><td>' + purchase['date'] + '</td><td><div class="avatar position-float-left" style="background: url(https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPH-XfXxbxMTizvaNTCZuugMAQeOErj8-7DcjloR9MgBAw6xxuQQ) 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 item-store-name" data-store-guid="' + purchase['guid'] + '">' + purchase['vendor'] + '</div></td><td>' + purchase['price'] + '</td><td>' + purchase['status'] + '</td></tr>');
    });
  },
}