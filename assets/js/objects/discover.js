$(function() {
  window.Discover.initialize();
});

window.Discover = {
  initialize: function(){
  },

  contracts: function contracts(updatePageViews, backwards){
    if (updatePageViews){
      pageViews.push({"page": "home", "active": true});
      Navigation.unsetActivePage();
    }
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.store, .store-settings, .store-banner, .store-banner-2, .store-footer, .loading-icon, .item-detail, .items, .button-try-again, .modal, .overlay, .transactions').hide();
    $('.ob-icon').show();
    
    if (backwards){
      $('.loading-message').html(_.shuffle(messages)[0]);
      $('.connecting').fadeIn();
      Connecting.load();
      setTimeout(function(){  
        $('.connecting').hide();
        $('.items').fadeIn('fast');
      }, 1000);
    }else{
      $('.loading-message').html('Connecting to stores...');
      $('.loading-icon').hide();
      $('.connecting').fadeIn();
      Connecting.load();
      setTimeout(function(){  
        populateFeed();
      }, delay);
    }
    Connecting.setDefualtColors(false);
  },

  populateFeed: function populateFeed(){
    $('.connecting').hide();
    $('.contracts').show();
    _.each(_.shuffle(vendors), function(vendor){
      _.each(_.shuffle(vendor.contracts), function(contract){
        Contract.renderGridContract(vendor, contract, '.contracts');
      });
    });
  }  
}