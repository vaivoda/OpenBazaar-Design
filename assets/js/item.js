$(function(){
  // events
  $(document).on("mouseover", ".item", itemEnter);
  $(document).on("mouseleave", ".item", itemLeave);
  $(document).on("click", ".item-meta-data, .item-image, .item-name", function(event) { 
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).data('storeGuid');
    var itemId = $(event.currentTarget).data('itemId');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    var item = _.find(store.items, function(item){ return item.id == itemId });
    stripPageHistory();
    displayItemDetail(store, item, true);
    setArrowOpacity();
  });

  // functions
  function itemEnter(event){
    $(event.currentTarget).css('background-color', 'transparent');
    $(event.currentTarget).find('.item-image').animate({top: '2px'}, 200, 'easeOutQuad');
  }

  function itemLeave(event){
    $(event.currentTarget).find('.item-image').animate({top: 0}, 200, 'easeOutQuad');
  }

  function displayItemDetail(store, item, updatePageViews){
    activePage = getActivePageType();
    setPageUrl(store.guid + '/' + item.id);

    if (updatePageViews){
      pageViews.push({"page": "item-detail", "itemid": item.id, "guid": store.guid, "active": true});
      unsetActivePage(); 
    } 

    if (item.quantity === 0){
      $('.item-detail-buy, .input-item-detail-quantity').hide();
      $('.item-detail-sold-out').show();
    }else{
      $('.item-detail-buy, .input-item-detail-quantity').show();
      $('.item-detail-sold-out').hide();
    } 

    $('.item-detail-price').html('<span class="type-weight-medium">' + item.price + ' btc</span>');
    $('.item-detail-quantity').val(1);  
    $('.store-message').attr('data-store-guid', store.guid);

    if (item.type === "physical"){
      $('.item-detail-shipping').html('shipping: <span class="type-weight-medium">+' + item.shipping + ' btc</span>').show();
      $('.item-detail-condition').html('condition: <span class="type-weight-medium">' + item.condition + '</span>').show();
      $('.item-detail-type').hide();
      $('.item-detail-quantity').show();
      $('.item-detail-buy').html('Buy');
    }else{
      $('.item-detail-type, .item-detail-quantity, .item-detail-shipping, .item-detail-condition').hide();
      $('.item-detail-buy').html('Buy & download');
    }

    if (activePage === "store"){
      $('.store, .item-detail, .button-try-again').hide();
      $('.item-detail-name').html(item.name);
      $('.item-detail-description').html(item.description);
      $('.item-detail-image').css('background-image', 'url(' + item.image + ')');
      $('.item-detail-meta').css('background', store.colorsecondary);
      $('.item-detail').fadeIn('slow');
    }else{
      $('.store, .store-banner, .store-footer, .items, .ob-icon, .button-try-again').hide();
      $('.connecting').fadeIn();
      $('.loading-icon').attr('src', store.avatar).show();
      $('.loading-message').html('Connecting to ' + storeHandle(store));
      showLoading();
      $('body, .navigation-controls, .navigation-controls span, .button-try-again, .control-panel li, .button-primary').animate({ backgroundColor: store.colorprimary, color: store.colortext }, fade);
      $('#header, .item-meta-data, .store-items .item, .store-banner, .store-footer, .item-detail-meta').animate({ backgroundColor: store.colorsecondary }, fade);
      setTimeout(function(){  
        if (connectToStore()){
          $('.items, .connecting').hide();
          $('.store-name').html(storeHandle(store)).attr('data-store-guid', store.guid);
          $('.store-description').html(store.description);
          $('.store-avatar').css('background-image', 'url(' + store.avatar + ')').attr('data-store-guid', store.guid);
          $('.store-banner, .store-footer').show();
          $('.item-detail-name').html(item.name);
          $('.item-detail-description').html(item.description);
          $('.item-detail-image').css('background-image', 'url(' + item.image + ')');
          $('.item-detail').fadeIn('slow');
        }else{
          $('#spinner').empty().hide();
          $('.loading-message').html('Connection failed');
          $('.button-try-again').removeData().attr('data-store-guid', store.guid).attr('data-item-id', item.id).attr('data-view', "item-detail").show();
        }
      }, delay);

    }
  }
})