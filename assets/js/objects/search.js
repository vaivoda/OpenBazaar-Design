$(function() {
  window.Search.initialize();
});

window.Search = {
  initialize: function() {
  },

  find: function find(){
    if($('.input-search').val().includes('@')){
      Search.byHandle($('.input-search').val());
    }else if($('.input-search').val() === ''){
      Discover.contracts(true, false);
      Navigation.setPageUrl();
    }else{
      Search.byKeyword($('.input-search').val());
    }
  },

  byHandle: function byHandle(handle){
    var tmpStore = Vendor.findByHandle(handle);
    if(tmpStore){
      Vendor.displayContracts(tmpStore, true, false);
      Navigation.setPageUrl(tmpStore.guid);
    }else{
      var user = User.find(handle);
      User.view(user, true);
      Navigation.setPageUrl(user.handle);
    }
  },

  byKeyword: function byKeyword(keyword){
    pageViews.push({"page": "search", "keywords": keyword, "active": true});
    Navigation.unsetActivePage();
    $('.store').hide();
    $('.items').empty();
    $('.loading-message').html('Searching for "' + keyword + '"');
    $('.connecting').fadeIn();
    $('.item').fadeTo(0, 0);
    Connect.load();
    Helper.setDefualtColors(false);
    setTimeout(function(){  
      Discover.contracts(false, false);
    }, delay);
  }
}