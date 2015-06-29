$(function() {
  window.Transaction.initialize();
});

window.Transaction = {
  initialize: function() {
    $(document).on("change", ".transactions-select", function(event){ Transaction.changeType(event) });
    $(document).on("click", ".transaction-detail", function(event){ Transaction.renderDetails(event) });
  },

  changeType: function changeType(event){
    Vendor.setPrimaryColor(defaultPrimaryColor);
    Vendor.setSecondaryColor(defaultSecondaryColor);
    Vendor.setTextColor(defaultTextColor);

    switch($(event.currentTarget).val()){
      case "purchases":
        Purchase.display();
        break;
      case "sales":
        Sale.display();
        break;
      case "cases":
        Case.display();
        break;
    }
  },

  renderDetails: function renderDetails(event){
    var purchaseId = $(event.currentTarget).data('id');
    var purchase = _.find(purchases, function(purchase){ return purchase.id == purchaseId });
    var type = $(event.currentTarget).data('transactionType');

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

    $('#main, .vendor-banner').addClass('blur');
    $('.modal-trade-flow').hide();
    $('.modal-purchase-dispute').attr('data-mod-guid', purchase['mod-guid'])
    $('.modal-mod-name').html(purchase['mod'])
    $('.modal-vendor-name').html(purchase.vendor);
    $('.modal-contract-name').html(purchase['contract-name']);
    $('.modal-transaction-id').html('ID: ' + purchase['id']);
    $('.modal-buyer-address').html(purchase['buyer-address']);
    $('.modal-photo-shadow, .modal-contract-price-style').show();
    $('.modal-contract-price').html(purchase['price']);
    $('.modal-mod-price').html(purchase['mod-fee']);
    $('.modal-shipping-price').html(purchase['shipping']);
    $('.modal-puchase-date').html(purchase['date']);
    $('.modal-mod-avatar').css('background', 'url(' + purchase['mod-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-buyer-avatar').css('background', 'url(' + purchase['buyer-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-vendor-avatar').css('background', 'url(' + purchase['vendor-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-purchase-detail .modal-transaction-price').html(status);
    $('.modal-purchase-detail .modal-photo').css('background', 'url(' + purchase['contract-image'] + ') 50% 50% / cover no-repeat');
    $('.overlay, .modal-purchase-detail').show();
    $('.modal-pretty').fadeTo(100, 100);
  }
}