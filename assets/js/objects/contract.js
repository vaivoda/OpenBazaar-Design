$(function() {
  window.Contract.initialize();
});

window.Contract = {
  initialize: function() {
    $(document).on("click", ".contract-detail-buy", function(){  Contract.displayCheckout() });
    $(document).on("click", ".contract-meta-data, .contract-image, .contract-name", function(event){ Contract.displayDetails(event) });
    $(document).on("click", ".contract-trade-payment-type-next", function(event){ Contract.displayTradeFlowAddress() });
    $(document).on("click", ".contract-trade-address-next", function(event){ Contract.displayTradeFlowSummary() });
    $(document).on("click", ".new-product-save", function(){ Contract.create() });
  },

  create: function create(){
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
    Vendor.setPrimaryColor($('.store-settings-primary-color').css('bgColor').replace('#',''));
    Vendor.setSecondaryColor($('.store-settings-secondary-color').css('bgColor').replace('#',''));
    Vendor.setTextColor($('.store-settings-font-color').css('bgColor').replace('#',''));


    // hide stuffs
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.overlay').hide();
    $('.modal').hide();      
    $('.settings-item-image').css('opacity', 100);
  },

  displayCheckout: function displayCheckout(){  
    $('.modal-purchase-detail').hide();

    // reset the colors
    Vendor.setPrimaryColor($('body').css('bgColor').replace('#',''));
    Vendor.setSecondaryColor($('#header').css('bgColor').replace('#',''));
    Vendor.setTextColor($('body').css('color').replace('#',''));

    var image = $('.contract-detail-image').css('background-image');
    var avatar = $('.vendor-avatar').css('background-image');
    var price = $('.contract-detail-price span').html();
    var name = $('.vendor-name').html();

    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat');
    $('.modal-pretty .direct-avatar').css('background', avatar + '100% 100% / cover no-repeat');
    $('.modal-pretty .modal-contract-price').html(price + ' ($52 USD)');
    $('.modal-pretty .modal-vendor-name').html(name);

    $('#main, .vendor-banner').addClass('blur');
    $('.modal-product, .modal-vendor-meta').hide();
    $('.overlay, .modal-trade-flow').show();
    $('.modal-pretty').fadeTo(100, 100);
  },

  displayDetails: function displayDetails(event){  
    event.stopPropagation();
    var vendorGuid = $(event.currentTarget).data('vendorGuid');
    var contractId = $(event.currentTarget).data('contractId');
    var vendor = _.find(vendors, function(vendor){ return vendor.guid == vendorGuid });
    var contract = _.find(vendor.contracts, function(contract){ return contract.id == contractId });
    Navigation.stripPageHistory();
    Navigation.setArrowOpacity();
    Contract.renderContractDetail(vendor, contract, true);
  },

  displayContractInModal: function displayContractInModal(){
    Modal.clear();

    $('.new-product-name').val(product.name);
    $('.new-product-description').val(product.description);
    $('.new-product-price').val(product.price);
    $('.new-product-shipping').val(product.shipping);
    // $('.new-product-condition').val();
    $('.new-product-photo-1').val(product.photo1);
    $('.new-product-photo-2').val(product.photo2);
    $('.new-product-photo-3').val(product.photo3);
    $('.new-product-website').val(product.photo3);

    Modal.show('basic');
  },

  displayTradeFlowSummary: function displayTradeFlowSummary(){
    $('.modal-item').html($('.item-detail-name').html());
    $('.modal-trade-flow-address').hide();
    $('.modal-trade-flow-summary').show();
    $('.modal-item-price-style, .modal-photo-shadow').hide();
    $('.modal-photo').css('background','#fff');
    Modal.setTitle('Summary');
  },

  displayTradeFlowAddress: function displayTradeFlowAddress(){
    $('.modal-trade-flow-payment-type').hide();
    $('.modal-trade-flow-address').show();
    Modal.setTitle('Ship to');
  },

  find: function find(id){
    return _.find($store, function(item){ return item.id == id });     
  },

  renderGridContract: function renderGridContract(vendor, contract, div){
    if (vendor.handle){
      var name = '@' + vendor.handle;
    }else{
      var name = vendor.name;
    }

    var randomNum = Math.ceil(Math.random() * 500) + 75;
    var output = '<div class="contract" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'"><div class="contract-image opacity-0" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'" style="background: url(' + contract.photo1 + ') 50% 50% / cover no-repeat"><div class="contract-image-gradient"></div></div><div class="contract-meta-data" data-vendor-guid="' + vendor.guid + '"><div class="position-padding-10px"><div class="contract-name" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'">' + contract.name + '</div><div class="contract-price position-margin-top-3px">' + contract.price + ' btc</div></div>';

    if (div === '.contracts'){
      output += '<div class="contract-vendor"><div class="contract-vendor-avatar" style="background-image: url(' + vendor.avatar + ')"></div><div class="contract-vendor-name" data-vendor-guid="' + vendor.guid + '">' + name + '</div></div>';
    }else{
      output += '</div></div></div>';
    }

    $(div).append(output);
    $(div + ' div:last-child .contract-image').delay(20).fadeTo(randomNum, 1);
  },

  renderContractDetail: function renderContractDetail(vendor, contract, updatePageViews){  
    activePage = Navigation.getActivePageType();
    Navigation.setPageUrl(vendor.guid + '/' + contract.id);

    if (updatePageViews){
      pageViews.push({"page": "contract-detail", "contractid": contract.id, "guid": vendor.guid, "active": true});
      Navigation.unsetActivePage(); 
    } 

    if (contract.quantity === 0){
      $('.contract-detail-buy, .input-contract-detail-quantity').hide();
      $('.contract-detail-sold-out').show();
    }else{
      $('.contract-detail-buy, .input-contract-detail-quantity').show();
      $('.contract-detail-sold-out').hide();
    } 

    $('.contract-detail-price').html('<span class="type-weight-medium">' + contract.price + ' btc</span>');
    $('.contract-detail-quantity').val(1);  
    $('.vendor-message').attr('data-vendor-guid', vendor.guid);
    $('.vendor-dets').attr('data-vendor-guid', vendor.guid);

    if (contract.type === "physical"){
      $('.contract-detail-shipping').html('shipping: <span class="type-weight-medium">+' + contract.shipping + ' btc</span>').show();
      $('.contract-detail-condition').html('condition: <span class="type-weight-medium">' + contract.condition + '</span>').show();
      $('.contract-detail-type').hide();
      $('.contract-detail-quantity').show();
      $('.contract-detail-buy').html('Buy');
    }else{
      $('.contract-detail-type, .contract-detail-quantity, .contract-detail-shipping, .contract-detail-condition').hide();
      $('.contract-detail-buy').html('Buy & download');
    }

    if (activePage === "vendor"){
      $('.vendor, .contract-detail, .button-try-again').hide();
      $('.contract-detail-name').html(contract.name);
      $('.contract-detail-description').html(contract.description);
      $('.contract-detail-image').css('background-image', 'url(' + contract.photo1 + ')');
      $('.contract-detail-meta').css('background', vendor.colorsecondary);
      $('.contract-detail').fadeIn('slow');
    }else{
      $('.vendor, .vendor-banner, .vendor-footer, .contracts, .ob-icon, .button-try-again').hide();
      $('.connecting').fadeIn();
      $('.loading-icon').attr('src', vendor.avatar).show();
      $('.loading-message').html('Connecting to ' + Vendor.handle(vendor));
      Connect.load();
      $('body, .navigation-controls, .navigation-controls span, .button-try-again, .control-panel li, .button-primary').animate({ backgroundColor: vendor.colorprimary, color: vendor.colortext }, fade);
      $('#header, .contract-meta-data, .vendor-contracts .contract, .vendor-details table, .vendor-banner, .vendor-footer, .contract-detail-meta').animate({ backgroundColor: vendor.colorsecondary }, fade);
      setTimeout(function(){  
        if (Connecting.connectToVendor()){
          $('.contract, .connecting').hide();
          $('.vendor-name').html(Vendor.handle(vendor)).attr('data-vendor-guid', vendor.guid);
          $('.vendor-home').attr('data-vendor-guid', vendor.guid);
          $('.vendor-description').html(vendor.description);
          $('.vendor-avatar').css('background-image', 'url(' + vendor.avatar + ')').attr('data-vendor-guid', vendor.guid);
          $('.vendor-banner, .vendor-footer').show();
          $('.contract-detail-name').html(contract.name);
          $('.contract-detail-description').html(contract.description);
          $('.contract-detail-image').css('background-image', 'url(' + contract.photo1 + ')');
          $('.contract-detail').fadeIn('slow');
        }else{
          $('#spinner').empty().hide();
          $('.loading-message').html('Connection failed');
          $('.button-try-again').removeData().attr('data-vendor-guid', vendor.guid).attr('data-contract-id', contract.id).attr('data-view', "contract-detail").show();
        }
      }, delay);

    }
  }
}