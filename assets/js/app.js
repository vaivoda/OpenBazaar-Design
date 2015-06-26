var pageViews = [{"page": "home", "active": true}]
var defaultPrimaryColor = "#086A9E";
var defaultSecondaryColor = "#327eb8";
var defaultTextColor = "#ffffff";
var delay = 1900; //3000
var fade = 500;
$store = {'avatar': '',
  'name': '',
  'description': '',
  'colorprimary': '',
  'colorsecondary': '',
  'colortext': '',
  'website': '',
  'email': '',
  'guid': '',
  'handle': '',
  'items': []};

$(function() {

  $.cssHooks.bgColor = {
      get: function(elem) {
          if (elem.currentStyle)
              var bg = elem.currentStyle["bgColor"];
          else if (window.getComputedStyle)
              var bg = document.defaultView.getComputedStyle(elem,
                  null).getPropertyValue("background-color");
          if (bg.search("rgb") == -1)
              return bg;
          else {
              bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
              function hex(x) {
                  return ("0" + parseInt(x).toString(16)).slice(-2);
              }
              return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
          }
      }
  }

  // events
  $(document).on("keyup", keypress);
  $(document).on("click", ".overlay, .close-modal, .trade-close", hideModal);
  $(document).on("click", ".trade-back-to-payment", tradeBackToPayment);
  $(document).on("click", ".trade-back-to-address", tradeBackToAddress);
  $(document).on("click", ".transaction-detail", showTransactionDetail);
  $(document).on("change", ".transactions-select", changeTransactionType);
  $(document).on("click", ".modal-navigation li", setActiveModalNav);
  $(document).on("click", ".control-panel-discover", toggleDiscovery);
  $(document).on("click", ".control-panel-user", toggleUserSettings);

  $('html').click(function(e) {
    $('.menu, .user-menu').fadeOut(100);
  });

  // functions
	function start(){
		Connecting.load();
		Chat.loadMessages();
		setTimeout(function(){  
			Discover.populateFeed();
		}, delay);
		Navigation.setArrowOpacity();
	}

  function showPurchases(){
    loadTransactions();
    setPrimaryColor(defaultPrimaryColor.replace('#',''));
    setSecondaryColor(defaultSecondaryColor.replace('#',''));
    setTextColor(defaultTextColor.replace('#',''));

    hideAllTheThings();
    $('.transactions-h1').html('Purchases');
    $('.transactions .transactions-purchases').show();
    setTimeout(function(){  
      $('.transactions').fadeTo(fade, 100);
    }, 100);
  }

  function changeTransactionType(e){
    var type = $(e.currentTarget).val();
    switch(type){
      case "purchases":
        showPurchases();
        break;
      case "sales":
        showSales();
        break;
      case "cases":
        showCases();
        break;
    }
  }

  function toggleDiscovery(e){
    e.stopPropagation();
    $('.menu').fadeToggle(100);
  }

  function toggleUserSettings(e){
    e.stopPropagation();
    $('.user-menu').fadeToggle(100);
  }

  function hideModal(){
    $('.modal-pretty, .modal').fadeTo(150, 0, function(){
      $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
      $('.modal-pretty, .modal').hide();
      $('.overlay').hide();
      $('.chat').show();
    });
  }

	function keypress(e){
  		e.stopPropagation();
    if($('.store-meta-name').is(':focus') && $('.store-meta-name').val() !== ""){
      $('.store-banner-2 .store-name').html($('.store-meta-name').val());
    }

    if($('.store-meta-description').is(':focus') && $('.store-meta-description').val() !== ""){
      $('.store-banner-2 .store-description').html($('.store-meta-description').val());
    }

    if($('.store-meta-avatar').is(':focus') && $('.store-meta-avatar').val() !== ""){
      $('.store-banner-2 .store-avatar').css('background', 'url(' + $('.store-meta-avatar').val() + ') 50% 50% / cover no-repeat');
    }

		if($('.input-chat-new-message').is(":focus") && e.which == 13) {
      Chat.saveMessage();
		}	

		if($('.input-search').is(":focus") && e.which == 13) {
      Search.find();
		}
  	Navigation.setArrowOpacity();
	}

  function tradeBackToPayment(){
    $('.modal-trade-flow-address').hide();
    $('.modal-pretty .modal-header').html('Payment type');
    $('.modal-trade-flow-payment-type').show();

  }

  function tradeBackToAddress(){
    var image = $('.item-detail-image').css('background-image');
    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat'); 
    $('.modal-item-price-style').show();
    $('.modal-photo-shadow').show();   
    $('.modal-trade-flow-summary').hide();
    $('.modal-pretty .modal-header').html('Ship to');
    $('.modal-trade-flow-address').show();
  }

  function showTransactionDetail(e){
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

  function setActiveModalNav(e){
    var target = $(e.currentTarget);
    var section = target.data('section');
    $('.modal-navigation ul li').removeClass('modal-navigation-selected');
    target.addClass('modal-navigation-selected');
    $('.modal-purchase-detail .modal-body table').hide();
    $('.' + section).show();
  }

  // functions
  function itemEnter(event){
    $(event.currentTarget).css('background-color', 'transparent');
    $(event.currentTarget).find('.item-image').animate({top: '2px'}, 200, 'easeOutQuad');
  }

  function itemLeave(event){
    $(event.currentTarget).find('.item-image').animate({top: 0}, 200, 'easeOutQuad');
  }

  $(document).on("click", ".store-dets", function(event){
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).attr('data-store-guid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    showStoreDetails(store);
  });

  // functions
  function hideAllTheThings(){
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.items, .store, .ob-icon, .item-detail, .store-settings, .store-banner, .store-banner-2, .store-footer, .button-try-again, .store-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  }

  // #############SETTINGS
  $(document).on("click", ".menu-store", settingsStore);
  $(document).on("click", ".new-product-save", createItem);
  $(document).on("click", ".settings-item-new, .settings-item-name-new", showProductModal);
  $(document).on("click", ".store-banner-2 .store-name, .store-banner-2 .store-avatar, .store-banner-2 .store-description", settingsStoreMeta);
  $(document).on("click", ".store-settings-save", createStore);
  $(document).on("click", ".settings-item-edit ", editItem);
  $(document).on("click", ".settings-item-delete ", deleteItem);
  $(document).on("mouseover", ".settings-item", showHoverButtons);
  $(document).on("mouseleave", ".settings-item", hideHoverButtons);
  $(document).on("click", ".store-meta-save", saveMeta);
  $(document).on("click", ".store-settings-cancel", function(event) {
    Discover.items(false, true);
    Navigation.setPageUrl();    
  });

  function createStore(){
    stores.push($store);
    var tmpStore = Vendor.findByHandle($('.store-meta-handle').val().replace('@',''));
    displayStore(tmpStore, true, false);
    Navigation.setPageUrl(tmpStore.guid);   
  }

  function editItem(e){
    var id = $(e.currentTarget).data('id');
    loadProduct(id);
  }

  function deleteItem(e){
    var id = $(e.currentTarget).data('id');
  }

  function showHoverButtons(){
    $('.settings-item-buttons').fadeTo(fade, 100);
  }
  function hideHoverButtons(){
    $('.settings-item-buttons').fadeTo(fade, 0);
  }

  function saveMeta(){
    $store.name = $('.store-meta-name').val();
    $store.avatar = $('.store-meta-avatar').val();
    $store.description = $('.store-meta-description').val();
    $store.guid = "bde33a7919ca28867d6b0acc5b9c09340607471a";
    $store.handle = $('.store-meta-handle').val().replace('@', '');   

    $('.overlay, .modal, .modal-store-meta').hide();
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
  }

  function settingsStoreMeta(){
    $('#main, .store-banner, .store-banner-2').addClass('blur');
    $('.modal-product, .chat').hide();
    $('.overlay, .modal, .modal-store-meta').show();
    $('.store-meta-name').focus();
  }

  function createItem(){
      var items = $store.items;
      var item = [];
      var id = Math.ceil(Math.random() * 10000) + 500

      item.id = id;
      item.name = $('.new-product-name').val();
      item.description = $('.new-product-description').val();
      item.price = $('.new-product-price').val();
      item.shipping = $('.new-product-shipping').val();
      item.type = $('.new-product-condition').val();
      item.photo1 = $('.new-product-photo-1').val();
      item.photo2 = $('.new-product-photo-2').val();
      item.photo3 = $('.new-product-photo-3').val();

      items.push(item);
      $store.items = items;

      // add prodcut to items list
      $('.store-settings-items').append('<div class="settings-item" data-store-guid="" data-item-id="' + id +'"><div class="settings-item-image opacity-0" data-store-guid="" data-item-id="' + id +'" style="background: url(' + $('.new-product-photo-1').val() + ') 50% 50% / cover no-repeat"><div class="settings-item-image-gradient"></div><div class="settings-item-buttons visibility-hidden"><button id="' + id + '" class="button-primary settings-item-edit position-margin-right-5px">Edit</button><button id="' + id + '" class="button-primary settings-item-delete">Delete</button></div></div><div class="settings-item-meta-data" data-store-guid=""><div class="position-padding-10px"><div class="settings-item-name" data-store-guid="" data-item-id="' + id +'">' + $('.new-product-name').val() + '</div><div class="settings-item-price position-margin-top-3px">' + $('.new-product-price').val() + ' btc</div></div>');

      // reset the colors
      setPrimaryColor($('.store-settings-primary-color').css('bgColor').replace('#',''));
      setSecondaryColor($('.store-settings-secondary-color').css('bgColor').replace('#',''));
      setTextColor($('.store-settings-font-color').css('bgColor').replace('#',''));

  
      // hide stuffs
      $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
      $('.overlay').hide();
      $('.modal').hide();      
      $('.settings-item-image').css('opacity', 100);
  }

  function loadProduct(id){
    var product = _.find($store, function(item){ return item.id == id }); 
    clearModal();

    $('.new-product-name').val(product.name);
    $('.new-product-description').val(product.description);
    $('.new-product-price').val(product.price);
    $('.new-product-shipping').val(product.shipping);
    // $('.new-product-condition').val();
    $('.new-product-photo-1').val(product.photo1);
    $('.new-product-photo-2').val(product.photo2);
    $('.new-product-photo-3').val(product.photo3);
    $('.new-product-website').val(product.photo3);

    showProductModal();
  }

  function clearModal(){
    $('.modal input, .modal textarea').val('');
  }

  function showProductModal(e){
    // $(e.currentTarget).

    $('.chat').hide();
    $('.modal-store-meta').hide();
    $('.modal-product').show();
    $('#main, .store-banner, .store-banner-2').addClass('blur');
    $('.overlay').show();
    $('.modal').show();
    $('.new-product-name').focus();
  }

  function enterStoreName(){
    $('.overlay').fadeIn(delay);
  }

  function settingsStore(){    
    fade = 0;   
    $('.store-name').html('Store name...').css('cursor', 'url("./assets/img/edit.png"), pointer');
    $('.store-description').html('Store description...');
    $('.settings-item-image').css('opacity', 100);

    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, .store-settings-primary-color, .modal').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
    $('.item-meta-data, .item-price').animate({ color: defaultTextColor }, fade);
    $('#header, .item-meta-data, .item-image, .store-settings-items .item, .store-banner-2, .store-details table, .store-settings-secondary-color,  .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .dropzone').animate({ backgroundColor: defaultSecondaryColor }, fade);
    $('.store-settings-font-color').css('background', defaultTextColor);

    $('.items, .store, .ob-icon, .item-detail, .store-footer, .connecting, .store-buttons, .store-banner, .button-try-again, .store-details').hide();
    $('.chat').css('bottom', '-240px');
    $('.chat').hide();
    $('.store-banner-2, .store-settings').fadeIn('slow');
    $('#main, .store-banner, .store-banner-2').addClass('blur');
    settingsStoreMeta();
  }

  start();
});