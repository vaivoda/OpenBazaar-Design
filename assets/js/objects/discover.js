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
    Helper.hideAll();
    $('.ob-icon').show();
    
    if (backwards){
      $('.loading-message').html(_.shuffle(messages)[0]);
      $('.connecting').fadeIn();
      Connect.load();
      setTimeout(function(){  
        $('.connecting').hide();
        $('.contracts').fadeIn('fast');
      }, 1000);
    }else{
      $('.loading-message').html('Connecting to stores...');
      $('.loading-icon').hide();
      $('.connecting').fadeIn();
      Connect.load();
      setTimeout(function(){  
        Discover.populateFeed();
      }, delay);
    }
    Vendor.setDefualtColors(false);
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