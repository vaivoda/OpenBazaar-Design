$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .vendor-banner, .vendor-banner-2, .chat').removeClass('blur');
    $('.contracts, .user-profile, .vendor, .vendor-contracts, .vendor-navigation, .ob-icon, .contract-detail, .user-configuration, .vendor-banner, .vendor-banner-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  },

  readURL: function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('.avatar-circle, .control-panel-user').css('background', 'url(' + e.target.result + ') 50% 50% / cover no-repeat');
      }

    reader.readAsDataURL(input.files[0]);
    }
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
  }
}