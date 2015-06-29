$(function() {
  window.Configuration.initialize();
});

window.Configuration = {
  initialize: function() {
    $(document).on("click", ".store-settings-cancel", function(event) {
      Discover.items(false, true);
      Navigation.setPageUrl();    
    });
    $(document).on("click", ".store-settings-save", function(){ 
      Vendor.create();
      var tmpVendor = Vendor.findByHandle($('.store-meta-handle').val());
      Vendor.displayContract(tmpVendor, true, false);
      Navigation.setPageUrl(tmpVendor.guid); 
    });
    $(document).on("click", ".store-meta-save", function(){
      Vendor.setMetaData();
      Modal.close();
    });
    $(document).on("click", ".settings-item-new, .settings-item-name-new", function(){
      Modal.show('basic');
      $('.modal-product').show();
      $('.new-product-name').focus();
    });
    $(document).on("mouseover", ".settings-item", function(){ $('.settings-item-buttons').fadeTo(fade, 100) });
    $(document).on("mouseleave", ".settings-item", function(){ $('.settings-item-buttons').fadeTo(fade, 0) });
    // $(document).on("click", ".settings-item-edit ", editItem);
    // $(document).on("click", ".settings-item-delete ", deleteItem);
  },
}

  // function settingsStoreMeta(){
  //   $('#main, .store-banner, .store-banner-2').addClass('blur');
  //   $('.modal-product, .chat').hide();
  //   $('.overlay, .modal, .modal-store-meta').show();
  //   $('.store-meta-name').focus();
  // }