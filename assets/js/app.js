var pageViews = [{"page": "home", "active": true}]
var defaultPrimaryColor = "#086A9E";
var defaultSecondaryColor = "#327eb8";
var defaultTextColor = "#ffffff";
var delay = 1900; //3000
var fade = 500;
$store = {'avatar': '', 'name': '', 'description': '', 'colorprimary': '', 'colorsecondary': '', 'colortext': '', 'website': '', 'email': '', 'guid': '', 'handle': '', 'items': []};

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
  $('html').click(function(e) { $('.menu, .user-menu').fadeOut(100); });

  // functions
	function start(){
		Connect.load();
		Chat.loadMessages();
		Navigation.setArrowOpacity();
		setTimeout(function(){ Discover.populateFeed() }, delay);
	}

	function keypress(e){
  	e.stopPropagation();

    if($('.input-search').is(":focus") && e.which == 13){ Search.find(); }
    if($('.input-chat-new-message').is(":focus") && e.which == 13) { Chat.saveMessage(); }
    if($('.store-meta-name').is(':focus') && $('.store-meta-name').val() !== ""){ $('.store-banner-2 .store-name').html($('.store-meta-name').val()); }
    if($('.store-meta-description').is(':focus') && $('.store-meta-description').val() !== ""){
      $('.store-banner-2 .store-description').html($('.store-meta-description').val());
    }
    if($('.store-meta-avatar').is(':focus') && $('.store-meta-avatar').val() !== ""){
      $('.store-banner-2 .store-avatar').css('background', 'url(' + $('.store-meta-avatar').val() + ') 50% 50% / cover no-repeat');
    }

  	Navigation.setArrowOpacity();
	}

  function hideAllTheThings(){
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.items, .store, .ob-icon, .item-detail, .store-settings, .store-banner, .store-banner-2, .store-footer, .button-try-again, .store-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  }

  $(document).on("click", ".menu-store", settingsStore);
  // $(document).on("click", ".store-banner-2 .store-name, .store-banner-2 .store-avatar, .store-banner-2 .store-description", settingsStoreMeta);

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