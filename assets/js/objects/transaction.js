$(function() {
  window.Transactions.initialize();
});

window.Transactions = {
  initialize: function() {
    $(document).on("change", ".transactions-select", function(event){ Transaction.changeType(event) });
    $(document).on("click", ".transaction-detail", function(){ Transaction.renderDetails() });
  },

  changeType: function changeType(event){
    var type = $(event.currentTarget).val();
    switch(type){
      case "purchases":
        Purchases.display();
        break;
      case "sales":
        Sales.display();
        break;
      case "cases":
        Cases.display();
        break;
    }
  },

  renderDetails: function renderDetails(){
    var purchaseId = $(e.currentTarget).data('id');
    var purchase = _.find(purchases, function(purchase){ return purchase.id == purchaseId });
    var type = $(e.currentTarget).data('transactionType');

    if (purchase.tracking != ""){
      var status = purchase.status + ": " + purchase.tracking;
    }else{
      var status = purchase.status;
    }

  $('.modal-navigation ul li').removeClass('modal-navigation-selected');
  $('.modal-navigation ul li:first').addClass('modal-navigation-selected');
  $('.modal-purchase-detail-summary, .modal-purchase-detail-shipping, .modal-purchase-detail-payment, .modal-purchase-detail-settings').hide();
  $('.modal-purchase-detail-summary').show();

    switch(type){
      case "purchase":
        $('.modal-purchase-release-funds').show();
        $('.modal-purchase-request-funds').hide();
        $('.modal-navigation ul li:nth-child(4)').hide();
        break;
      case "sale":
        $('.modal-purchase-release-funds').hide();
        $('.modal-purchase-request-funds').show();
        $('.modal-navigation ul li:nth-child(4)').show();

        break;
      case "case":
        break;
    }

    $('#main, .store-banner').addClass('blur');
    $('.modal-trade-flow').hide();
    $('.modal-purchase-dispute').attr('data-mod-guid', purchase['mod-guid'])
    $('.modal-mod-name').html(purchase['mod'])
    $('.modal-store-name').html(purchase.vendor);
    $('.modal-item-name').html(purchase['item-name']);
    $('.modal-transaction-id').html('ID: ' + purchase['id']);
    $('.modal-buyer-address').html(purchase['buyer-address']);
    $('.modal-photo-shadow, .modal-item-price-style').show();
    $('.modal-item-price').html(purchase['price']);
    $('.modal-mod-price').html(purchase['mod-fee']);
    $('.modal-shipping-price').html(purchase['shipping']);
    $('.modal-puchase-date').html(purchase['date']);
    $('.modal-mod-avatar').css('background', 'url(' + purchase['mod-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-buyer-avatar').css('background', 'url(' + purchase['buyer-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-store-avatar').css('background', 'url(' + purchase['vendor-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-purchase-detail .modal-transaction-price').html(status);
    $('.modal-purchase-detail .modal-photo').css('background', 'url(' + purchase['item-image'] + ') 50% 50% / cover no-repeat');
    $('.overlay, .modal-purchase-detail').show();
    $('.modal-pretty').fadeTo(100, 100);
  }
}