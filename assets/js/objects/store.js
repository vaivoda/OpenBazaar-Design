$(function(){
  // events
  $(document).on("click", ".store-message", function(event){
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).data('storeGuid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    startNewChat(store);
  });


  $(document).on("click", ".item-store-name, .store-name, .store-avatar", function(event) { 
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).data('storeGuid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid })
    stripPageHistory();
    displayStore(store, true, false);
    setArrowOpacity();
  });

  // functions
  function storeHandle(store){
    if (store.handle){
      var name = '@' + store.handle;
    }else{
      var name = store.name;
    }   
    return name;
  }

  function connectToStore(){
    var arr = _.shuffle([1,2,3,4,5]);
    if (_.first(arr) == 1){
      return false;
    }else{
      return true;
    }
  }
  
  function displayStore(store, updatePageViews, instant, autoConnect){
    if (instant){ delay = 0; fade = 0; } else {  delay = 1900; fade = 500; }
    $('.store-items').empty();
    if (updatePageViews){
      pageViews.push({"page": "store", "guid": store.guid, "active": true});
      unsetActivePage();
    }
    _.each(store.items, function(item, index){
      renderGridItem(store, item, '.store-items');
    });

    $('.items, .store, .ob-icon, .item-detail, .store-banner, .store-footer, .button-try-again').hide();
    $('.connecting').fadeIn();
    $('.loading-icon').attr('src', store.avatar).show();
    $('.store-message').attr('data-store-guid', store.guid);
    $('.loading-message').html('Connecting to ' + storeHandle(store));
    showLoading();
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary').animate({ backgroundColor: store.colorprimary, color: store.colortext }, fade);
    $('.item-meta-data, .item-price').animate({ color: store.colortext }, fade);
    $('#header, .item-meta-data, .item-image, .store-items .item, .store-banner').animate({ backgroundColor: store.colorsecondary }, fade);
    setTimeout(function(){  
      if (connectToStore() ||  autoConnect){
        $('.items, .connecting').hide();
        $('.store-name').html(storeHandle(store)).attr('data-store-guid', store.guid);
        $('.store-description').html(store.description);
        $('.store-avatar').css('background-image', 'url(' + store.avatar + ')').attr('data-store-guid', store.guid);
        $('.store-banner, .store-footer').show();
        if (instant){
          $('.store').show();
        }else{
          $('.store').fadeIn('slow');
        }
      }else{
        $('#spinner').empty().hide();
        $('.loading-message').html('Connection failed');
        $('.button-try-again').removeData().attr('data-store-guid', store.guid).attr('data-view', "item-detail").attr('data-view', "store").show();
      }
    }, delay);
  }

})