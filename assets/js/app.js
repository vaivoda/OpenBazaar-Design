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
    if($('.store-meta-description').is(':focus') && $('.store-meta-description').val() !== ""){ $('.store-banner-2 .store-description').html($('.store-meta-description').val()); }
    if($('.store-meta-avatar').is(':focus') && $('.store-meta-avatar').val() !== ""){ $('.store-banner-2 .store-avatar').css('background', 'url(' + $('.store-meta-avatar').val() + ') 50% 50% / cover no-repeat'); }

  	Navigation.setArrowOpacity();
	}

  start();
});