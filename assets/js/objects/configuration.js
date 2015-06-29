$(function() {
  window.Configuration.initialize();
});

window.Configuration = {
  initialize: function() {
    $(document).on("click", ".modal-settings-cancel", function(event) {
      Discover.items(false, true);
      Navigation.setPageUrl();    
    });
    $(document).on("click", ".modal-settings-save", function(){ 
      Vendor.create();
      var tmpVendor = Vendor.findByHandle($('.modal-meta-handle').val());
      Vendor.displayContract(tmpVendor, true, false);
      Navigation.setPageUrl(tmpVendor.guid); 
    });
    $(document).on("click", ".modal-meta-save", function(){
      Vendor.setMetaData();
      Modal.close();
    });
    $(document).on("click", ".settings-contract-new, .settings-contract-name-new", function(){
      Modal.show('basic');
      $('.modal-product').show();
      $('.new-product-name').focus();
    });
    $(document).on("mouseover", ".settings-contract", function(){ $('.settings-contract-buttons').fadeTo(fade, 100) });
    $(document).on("mouseleave", ".settings-contract", function(){ $('.settings-contract-buttons').fadeTo(fade, 0) });
    $(document).on("click", ".menu-configuration", function() { Configuration.page() });
    // $(document).on("click", ".settings-item-edit ", editItem);
    // $(document).on("click", ".settings-item-delete ", deleteItem);
  },

  page: function page(){
    fade = 0;   
    $('.vendor-name').html('Store name...').css('cursor', 'url("./assets/img/edit.png"), pointer');
    $('.vendor-description').html('Store description...');
    $('.settings-contract-image').css('opacity', 100);

    Vendor.setPrimaryColor(defaultPrimaryColor);
    Vendor.setSecondaryColor(defaultSecondaryColor);
    Vendor.setTextColor(defaultTextColor);
    Helper.hideAll();
    $('.user-configuration').show();
    $('.chat').css('bottom', '-240px');
    $('.chat').hide();
    $('.vendor-banner-2, .modal-settings').fadeIn('slow');
    $('#main, .vendor-banner, .vendor-banner-2').addClass('blur');
    Configuration.pageMeta();
  },

  pageMeta: function pageMeta(){
    $('#main, .vendor-banner, .vendor-banner-2').addClass('blur');
    $('.modal-product, .chat').hide();
    $('.overlay, .modal, .modal-vendor-meta').show();
    $('.vendor-meta-name').focus();    
  }
}