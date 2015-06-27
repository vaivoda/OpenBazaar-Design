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
      Discover.items(true, false);
      Navigation.setPageUrl();
    }else{
      Search.byKeyword($('.input-search').val());
    }
  },

  byHandle: function byHandle(handle){
    var tmpStore = Vendor.findByHandle(handle);
    displayStore(tmpStore, true, false);
    Navigation.setPageUrl(tmpStore.guid);
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
    Vendor.setDefualtColors(false);
    setTimeout(function(){  
      Discover.items(false, false);
    }, delay);
  }
}