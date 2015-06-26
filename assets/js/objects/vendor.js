$(function() {
  window.Vendor.initialize();
});

window.Vendor = {
  initialize: function() {
    $(document).on("click", ".item-vendor-name, .vendor-banner .vendor-name, .vendor-banner .vendor-avatar, .vendor-home", function(event) { 
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
      Vendor.displayItems(Vendor.find(vendorGuid), true, false);
    });
    $('.vendor-settings-primary-color').ColorPicker({
      color: defaultPrimaryColor,
      onChange: function (hsb, hex, rgb) {
        setPrimaryColor(hex);
      } 
    });
    $('.vendor-settings-secondary-color').ColorPicker({
      color: defaultSecondaryColor,
      onChange: function (hsb, hex, rgb) {
        setSecondaryColor(hex);
      } 
    });
    $('.vendor-settings-font-color').ColorPicker({
      color: defaultTextColor,
      onChange: function (hsb, hex, rgb) {
        setTextColor(hex);
      } 
    });
  },

  find: function find(guid){  
    return _.find(vendors, function(vendor){ return vendor.guid == guid });
  },  

  findByHandle: function findByHandle(handle){  
    return _.find(vendors, function(vendor){ return vendor.handle == handle.replace('@','') });
  },  

  displayDetails: function displayDetails(vendor){  
    $('.vendor-items, .item-detail').hide();
    $('.vendor-details').fadeIn();
    $('.vendor-details-website').html('<a href="' + vendor.website + '" target="_blank">' + vendor.website + '</a>');
    $('.vendor-details-email').html(vendor.email);
    $('.vendor-details-public-key').html(vendor.publicKey);
    $('.vendor-details-pledge').html(vendor.pledge);
    $('.vendor-details-pgp-key').html($.parseHTML(vendor.pgpKey));
  },
  
  displayItems: function displayItems(vendor, updatePageViews, instant, autoConnect){  
    if (instant){ delay = 0; fade = 0; } else {  delay = 1900; fade = 500; }
    $('.vendor-items').empty();
    if (updatePageViews){
      pageViews.push({"page": "store", "guid": vendor.guid, "active": true});
      Navigation.unsetActivePage();
    }
    _.each(vendor.items, function(item, index){
      renderGridItem(store, item, '.vendor-items');
    });

    hideAllTheThings();
    $('.connecting').fadeIn();
    $('.loading-icon').attr('src', vendor.avatar).show();
    $('.vendor-message').attr('data-vendor-guid', vendor.guid);
    $('.loading-message').html('Connecting to ' + storeHandle(store));
    Connecting.load();
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary').animate({ backgroundColor: vendor.colorprimary, color: vendor.colortext }, fade);
    $('.item-meta-data, .item-price').animate({ color: vendor.colortext }, fade);
    $('#header, .item-meta-data, .item-image, .vendor-items .item, .vendor-banner, .vendor-details table').animate({ backgroundColor: vendor.colorsecondary }, fade);
    setTimeout(function(){  
      if (connectToStore() ||  autoConnect){
        $('.items, .connecting').hide();
        $('.vendor-items, .vendor-buttons').show();
        $('.vendor-name').html(storeHandle(store)).attr('data-vendor-guid', vendor.guid);
        $('.vendor-home').attr('data-vendor-guid', vendor.guid);
        $('.vendor-dets').attr('data-vendor-guid', vendor.guid);
        $('.vendor-description').html(vendor.description);
        $('.vendor-avatar').css('background-image', 'url(' + vendor.avatar + ')').attr('data-vendor-guid', vendor.guid);
        $('.vendor-banner, .vendor-footer').show();
        if (instant){
          $('.store').show();
        }else{
          $('.store').fadeIn('slow');
        }
      }else{
        $('#spinner').empty().hide();
        $('.loading-message').html('Connection failed');
        $('.button-try-again').removeData().attr('data-vendor-guid', vendor.guid).attr('data-view', "item-detail").attr('data-view', "store").show();
      }
    }, delay);
  }, 

  handle: function handle(vendor){  
    if (vendor.handle){
      var name = '@' + vendor.handle;
    }else{
      var name = vendor.name;
    }   
    return name;
  }, 

  setDefualtColors: function setDefualtColors(instant){
    if (instant){
      $('body, .navigation-controls, .navigation-controls span, .control-panel li').css('background', defaultPrimaryColor);
      $('#header, .item-meta-data').css('background', defaultSecondaryColor); 
      $('.item-price, .item-meta-data').css('color', defaultTextColor); 
    }else{
      $('body, .navigation-controls, .navigation-controls span, .control-panel li').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
      $('#header, .item-meta-data').animate({ backgroundColor: defaultSecondaryColor }, fade);  
      $('.item-meta-data, .item-price').animate({ color: defaultTextColor });
    }
  },

  setPrimaryColor: function setPrimaryColor(hex){  
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, vendor-settings-primary-color, .modal, .modal-pretty, .vendor-avatar').css('background-color', '#' + hex);
    $('.vendor-settings-primary-color').css('background-color', '#' + hex);
    $('.modal-pretty button.button-first').css('border-right-color', '#' + hex);
    $store.colorprimary = '#' + hex;
  },

  setSecondaryColor: function setSecondaryColor(hex){  
    $('#header, .settings-item, .settings-item-meta-data, .vendor-banner-2, .vendor-details table, .vendor-settings-secondary-color, .transactions table thead tr, .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .dropzone').css('background-color', '#' + hex);
    $('.modal-pretty table td').css('border-bottom-color', '#' + hex);
    $store.colorsecondary = '#' + hex;
  },

  setTextColor: function setTextColor(hex){  
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, vendor-settings-primary-color, .vendor-settings-items .settings-item-meta-data, .settings-add-new, .vendor-settings-items .settings-item-price, .modal input, .modal select, .modal textarea, .modal-pretty input, .modal-pretty select, .modal-pretty textarea, .modal-pretty button').css('color',  '#' + hex);
    $('.vendor-settings-font-color').css('background-color', '#' + hex);
    $('.settings-add-new').css('border-color', '#' + hex);
    $store.colortext = '#' + hex;
  }
}