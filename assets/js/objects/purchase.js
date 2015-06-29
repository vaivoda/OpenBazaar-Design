$(function() {
  window.Purchase.initialize();
});

window.Purchase = {
  initialize: function() {
  },

  display: function display(){
    Purchase.load();
    Helper.hideAll();
    Vendor.setPrimaryColor(defaultPrimaryColor);
    Vendor.setSecondaryColor(defaultSecondaryColor);
    Vendor.setTextColor(defaultTextColor);
    $('.transactions-h1').html('Purchases');
    $('.transactions-sales, .transactions-cases').hide();
    $('.transactions').fadeTo(100, 100);
    $('.transactions-purchases').show();
  },

  load: function load(){
    $('.transactions .transactions-purchases tbody').empty();

    _.each(purchases, function(purchase){ 
      $('.transactions .transactions-purchases tbody').append('<tr class="transaction-detail" data-id="' + purchase['id'] + '" data-transaction-type="purchase"><td><div class="avatar purchase-contract position-float-left" style="background: url(' + purchase['contract-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-contract position-margin-top-15px position-margin-left-8px">' + purchase['contract-name'] + '</div></td><td>' + purchase['date'] + '</td><td><div class="avatar position-float-left" style="background: url(https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPH-XfXxbxMTizvaNTCZuugMAQeOErj8-7DcjloR9MgBAw6xxuQQ) 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + purchase['guid'] + '">' + purchase['vendor'] + '</div></td><td>' + purchase['price'] + '</td><td>' + purchase['status'] + '</td></tr>');
    });
  },
}