$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .vendor-banner, .vendor-banner-2, .chat').removeClass('blur');
    $('.contracts, .vendor, .vendor-contracts, .vendor-navigation, .ob-icon, .contract-detail, .user-configuration, .vendor-banner, .vendor-banner-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  }
}