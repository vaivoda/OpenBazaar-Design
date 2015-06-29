$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .vendor-banner, .vendor-banner-2, .chat').removeClass('blur');
    $('.contracts, .vendor, .ob-icon, .contract-detail, .vendor-settings, .vendor-banner, .vendor-banner-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  }
}