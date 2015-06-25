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


  $('.store-settings-primary-color').ColorPicker({
    color: defaultPrimaryColor,
    onChange: function (hsb, hex, rgb) {
      setPrimaryColor(hex);
    } 
  });
  $('.store-settings-secondary-color').ColorPicker({
    color: defaultSecondaryColor,
    onChange: function (hsb, hex, rgb) {
      setSecondaryColor(hex);
    } 
  });
  $('.store-settings-font-color').ColorPicker({
    color: defaultTextColor,
    onChange: function (hsb, hex, rgb) {
      setTextColor(hex);
    } 
  });

  // events
  $(document).on("keyup", keypress);
  $(document).on("click", ".navigation-controls-back", stepBack);
  $(document).on("click", ".overlay, .close-modal, .trade-close", hideModal);
  $(document).on("click", ".trade-back-to-payment", tradeBackToPayment);
  $(document).on("click", ".trade-back-to-address", tradeBackToAddress);
  $(document).on("click", ".navigation-controls-forward", stepForward);
  $(document).on("click", ".control-panel-share", share);
  $(document).on("click", ".transaction-detail", showTransactionDetail);
  $(document).on("change", ".transactions-select", changeTransactionType);
  $(document).on("click", ".modal-navigation li", setActiveModalNav);
  $(document).on("click", ".control-panel-discover", toggleDiscovery);
  $(document).on("click", ".control-panel-user", toggleUserSettings);
  $(document).on("click", ".menu-transaction", showPurchases);
  $(document).on("click", ".button-try-again", function(event){
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).data('storeGuid');
    var itemId = $(event.currentTarget).data('itemId');
    var view = $(event.currentTarget).data('view');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    var item = _.find(store.items, function(item){ return item.id == itemId });
    switch(view){
      case "store":
        displayStore(store, false, false);
        break;
      case "item-detail":
        displayItemDetail(store, item, false);
        break;
    }
    stripPageHistory();
    setArrowOpacity();
  });

  $(document).on("click", ".menu-home", function(event){
    displayHome(true, false);
    setPageUrl();
  });

  $('html').click(function(e) {
    $('.menu, .user-menu').fadeOut(100);
  });

  // functions
	function start(){
		showLoading();
		loadMessages();
		setTimeout(function(){  
			populateFeed();
		}, delay);
		setArrowOpacity();
	}

  function setPrimaryColor(hex){
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, store-settings-primary-color, .modal, .modal-pretty, .store-avatar').css('background-color', '#' + hex);
    $('.store-settings-primary-color').css('background-color', '#' + hex);
    $('.modal-pretty button.button-first').css('border-right-color', '#' + hex);
    $store.colorprimary = '#' + hex;
  }

  function setSecondaryColor(hex){
    $('#header, .settings-item, .settings-item-meta-data, .store-banner-2, .store-details table, .store-settings-secondary-color, .transactions table thead tr, .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .dropzone').css('background-color', '#' + hex);
    $('.modal-pretty table td').css('border-bottom-color', '#' + hex);
    $store.colorsecondary = '#' + hex;
  }

  function setTextColor(hex){
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, store-settings-primary-color, .store-settings-items .settings-item-meta-data, .settings-add-new, .store-settings-items .settings-item-price, .modal input, .modal select, .modal textarea, .modal-pretty input, .modal-pretty select, .modal-pretty textarea, .modal-pretty button').css('color',  '#' + hex);
    $('.store-settings-font-color').css('background-color', '#' + hex);
    $('.settings-add-new').css('border-color', '#' + hex);
    $store.colortext = '#' + hex;
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

  function showSales(){
    loadSales();
    $('.transactions-h1').html('Sales');
    $('.transactions-purchases, .transactions-cases').hide();
    $('.transactions .transactions-sales').show();
  }

  function showCases(){
    loadCases();
    $('.transactions-h1').html('Cases');
    $('.transactions-purchases, .transactions-sales').hide();
    $('.transactions .transactions-cases').show();
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

		// if($('.input-search').is(":focus") && e.which == 64) {
		// 	$('.input-search-helper').show();
		// });

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
			var id = $('.input-chat-new-message').attr('data-id');
			var chat = _.find(chats, function(chat){ return chat.id == id });
			var newMessage = {
				"from": "@mike",
				"message": $('.input-chat-new-message').val(),
				"avatar": "https://lh4.googleusercontent.com/--248Dl6ElQU/AAAAAAAAAAI/AAAAAAAAAAA/BX_O_7Ha0fI/s128-c-k/photo.jpg"
			}
			chat.conversation.push(newMessage);
			$('.input-chat-new-message').val('');
			$('.chat-conversation-detail-body').scrollTop($('.chat-conversation-detail-body')[0].scrollHeight);
			viewChatDetails(id);
		}	

		if($('.input-search').is(":focus") && e.which == 13) {

      if($('.input-search').val().includes('@')){
        var tmpStore = findStore($('.input-search').val().replace('@',''));
        displayStore(tmpStore, true, false);
        setPageUrl(tmpStore.guid);
      }else if($('.input-search').val() === ''){
        displayHome(true, false);
        setPageUrl();
      }else{
        pageViews.push({"page": "search", "keywords": $('.input-search').val(), "active": true});
        unsetActivePage();
        $('.store').hide();
        $('.items').empty();
        $('.loading-message').html('Searching for "' + $('.input-search').val() + '"');
        $('.connecting').fadeIn();
        $('.item').fadeTo(0, 0);
        showLoading();
        setDefualtColors(false);
        setTimeout(function(){  
          displayHome(false, false);
        }, delay);
      }

		}
  		setArrowOpacity();
	}

  function findStore(handle){
    return _.find(stores, function(store){ return store.handle == handle });
  }

	function populateFeed(){
		$('.connecting').hide();
		$('.items').show();
		_.each(_.shuffle(stores), function(store){
 			_.each(_.shuffle(store.items), function(item){
				renderGridItem(store, item, '.items');
    		});
		});
	}

	function share(){
		alert("don't!!s!");
	}

	function stepForward(){
		var activePage = _.find(pageViews, function(page){ return page.active == true });
		var pageIndex = _.indexOf(pageViews, activePage);
		if (pageIndex+1 < pageViews.length){
			var nextPage = pageViews[pageIndex+1];
			switch(nextPage.page){
				case "home":
					displayHome(false, false);
					unsetActivePage();
					setAsCurrentPage(nextPage);
					setPageUrl();
					break;
				case "item-detail":
			  		var store = _.find(stores, function(item){ return item.guid == nextPage.guid })
  					var item = _.find(store.items, function(item){ return item.id == nextPage.itemid });
					displayItemDetail(store, item, false);
					unsetActivePage();
					setAsCurrentPage(nextPage);
					setPageUrl(store.guid + '/' + item.id);
					break;
				case "store":
			  		var store = _.find(stores, function(item){ return item.guid == nextPage.guid })
			  		displayStore(store, false, false);
					unsetActivePage();
					setAsCurrentPage(nextPage);
					setPageUrl(store.guid);
					break;
			}
		}	
  		setArrowOpacity();
	}

	function stepBack(){
		var activePage = _.find(pageViews, function(page){ return page.active == true });
		var pageIndex = _.indexOf(pageViews, activePage);
		if (pageIndex > 0){
			var previousPage = pageViews[pageIndex-1];

			switch(previousPage.page){
				case "home":
					displayHome(false, true);
					unsetActivePage();
					setAsCurrentPage(previousPage);
					setPageUrl();
					break;
				case "item-detail":
			  		var store = _.find(stores, function(item){ return item.guid == previousPage.guid })
  					var item = _.find(store.items, function(item){ return item.id == previousPage.itemid });
					displayItemDetail(store, item, false);
					unsetActivePage();
					setAsCurrentPage(previousPage);
					setPageUrl(store.guid + '/' + store.id);
					break;
				case "store":
			  	var store = _.find(stores, function(item){ return item.guid == previousPage.guid })
			  		displayStore(store, false, true, true);
					unsetActivePage();
					setAsCurrentPage(previousPage);
					setPageUrl(store.guid);
					break;
			}
		}
  		setArrowOpacity();
	}


	function setDefualtColors(instant){
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

	function showLoading(){
		var opts = {
		  lines: 12, // The number of lines to draw
		  length: 8, // The length of each line
		  width: 2, // The line thickness
		  radius: 8, // The radius of the inner circle
		  corners: 4, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#fff', // #rgb or #rrggbb or array of colors
		  speed: 0.9, // Rounds per second
		  trail: 50, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '50%', // Top position relative to parent
		  left: '50%' // Left position relative to parent
		};

		var target = document.getElementById('spinner');
		$(target).empty().show();
		var spinner = new Spinner(opts).spin(target);
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

	function unsetActivePage(){
		var page = _.find(pageViews, function(item) { return item.active === true })
		if (page){
			page.active = false;
		}
	}

	function displayHome(updatePageViews, backwards){
		if (updatePageViews){
			pageViews.push({"page": "home", "active": true});
			unsetActivePage();
		}
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
		$('.store, .store-settings, .store-banner, .store-banner-2, .store-footer, .loading-icon, .item-detail, .items, .button-try-again, .modal, .overlay, .transactions').hide();
		$('.ob-icon').show();
		
		if (backwards){
			$('.loading-message').html(_.shuffle(messages)[0]);
			$('.connecting').fadeIn();
			showLoading();
			setTimeout(function(){  
				$('.connecting').hide();
				$('.items').fadeIn('fast');
			}, 1000);
		}else{
			$('.loading-message').html('Connecting to stores...');
			$('.loading-icon').hide();
			$('.connecting').fadeIn();
			showLoading();
			setTimeout(function(){  
				populateFeed();
			}, delay);
		}
		setDefualtColors(false);
	}

	function renderGridItem(store, item, div){
		if (store.handle){
			var name = '@' + store.handle;
		}else{
			var name = store.name;
		}

		var randomNum = Math.ceil(Math.random() * 500) + 75;
		var output = '<div class="item" data-store-guid="' + store.guid + '" data-item-id="' + item.id +'"><div class="item-image opacity-0" data-store-guid="' + store.guid + '" data-item-id="' + item.id +'" style="background: url(' + item.photo1 + ') 50% 50% / cover no-repeat"><div class="item-image-gradient"></div></div><div class="item-meta-data" data-store-guid="' + store.guid + '"><div class="position-padding-10px"><div class="item-name" data-store-guid="' + store.guid + '" data-item-id="' + item.id +'">' + item.name + '</div><div class="item-price position-margin-top-3px">' + item.price + ' btc</div></div>';

		if (div === '.items'){
			output += '<div class="item-store"><div class="item-store-avatar" style="background-image: url(' + store.avatar + ')"></div><div class="item-store-name" data-store-guid="' + store.guid + '">' + name + '</div></div>';
		}else{
			output += '</div></div></div>';
		}

		$(div).append(output);
		$(div + ' div:last-child .item-image').delay(20).fadeTo(randomNum, 1);
	}

	function stripPageHistory(){
		var page = _.find(pageViews, function(item) { return item.active === true });
		var currentPageIndex = _.indexOf(pageViews, page);
		var tmpPageViews = [];

		_.each(pageViews, function(page, index){
			if (index <= currentPageIndex){
				tmpPageViews.push(page);
			}
		});
		pageViews = tmpPageViews;
	}

	function setAsCurrentPage(page){
		page.active = true;
	}

	function setArrowOpacity() {
		var page = _.find(pageViews, function(item) { return item.active === true });
		var pageViewSize = pageViews.length - 1;
		var currentPageIndex = _.indexOf(pageViews, page);

		if (currentPageIndex === 0 && currentPageIndex === pageViewSize){
			$('.navigation-controls-back span, .navigation-controls-forward span').fadeTo('fast', 0.3);
		}else if(currentPageIndex === 0 && currentPageIndex !== pageViewSize ){
			$('.navigation-controls-back span').fadeTo('fast', 0.3);
			$('.navigation-controls-forward span').fadeTo('fast', 1.0);
		}else if(currentPageIndex > 0 && currentPageIndex !== pageViewSize){
			$('.navigation-controls-back span').fadeTo('fast', 1.0);
			$('.navigation-controls-forward span').fadeTo('fast', 1.0);			
		}else if(currentPageIndex > 0 && currentPageIndex === pageViewSize){
			$('.navigation-controls-back span').fadeTo('fast', 1.0);
			$('.navigation-controls-forward span').fadeTo('fast', 0.3);			
		}
	}

	function getActivePageType(){
		var activePage = _.find(pageViews, function(page){ return page.active == true });

		return activePage.page;
	}

	function setPageUrl(params){
		var input = $('.input-search');
		if (params){
			input.val('ob://' + params);
		}else{
			input.val('');
		}
	}



	// #########CHAT
	// events
  $(document).on("click", ".chat-header, .chat-close", toggleChat);
	$(document).on("click", ".chat-view-all", chatViewAll);
	$(document).on("click", ".chat-message", function(event){
		var id = $(event.currentTarget).parent().parent().data('id');
		viewChatDetails(id);
	});

	$(document).on("click", ".chat-avatar", function(event){
		var id = $(event.currentTarget).parent().parent().data('id');
		viewChatDetails(id);
	});

  // functions
  function toggleChat(e){
    e.stopPropagation();
    if ($('.chat').css('bottom') === "-310px"){
      $('.chat-count').hide();
      $('.chat-close').show();
      $('.chat-new').show();
      $('.chat-conversations').scrollTop(0);
      $('.chat').css('bottom','0px');
    }else if ($('.chat').css('bottom') === "70px"){
      $('.chat-close').hide();
      $('.chat-new').hide();
      if ($('.chat-message-count').length === 0){
        $('.chat-count').hide();
      }else{
        $('.chat-count').show();
      }
      $('.chat').css('bottom','-240px');
    }else if ($('.chat').css('bottom') === "-240px"){
      $('.chat-count').hide();
      $('.chat-close').show();
      $('.chat-new').show();
      $('.chat-conversations').scrollTop(0);
      $('.chat').css('bottom','70px');
    }else{
    	if ($(e.currentTarget).hasClass('chat-header')){
    		chatViewAll();
    	}else{
    		chatViewAll();
	      $('.chat-close').hide();
	      $('.chat-new').hide();
		    if ($('.chat-message-count').length === 0){
		    	$('.chat-count').hide();
		    }else{
		    	$('.chat-count').show();
		    }
	      $('.chat').css('bottom','-310px');  		
    	}
    }
  }

  function chatViewAll(){
    $('.chat-message').show();
    $('.chat-conversation-detail').hide();
    $('.chat-avatar').fadeTo(0, 1);
    $('.chat-conversations').css('overflow-y','scroll');
    $('.chat-title').html('Messages');
  }

  function viewChatDetails(id, e){
    var chat = _.find(chats, function(chat){ return chat.id == id });
    $('.chat-view-details[data-id=' + id + ']').addClass('chat-read');
    $('.chat-conversations').css('overflow','hidden');
    $('.input-chat-new-message').val('');
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-view-details').not( '[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 0.15);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 1);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-message-count').remove();
    $('.input-chat-new-message').focus();
    $('.input-chat-new-message').attr('data-id', id);
    $('.chat-title').html('<div class="chat-view-all chat-back button-chat-control position-float-left"><</div><div class="chat-view-all position-float-left"> ' + chat.from + '</div>');
    $('.chat-count').html($('.chat-message-count').length);
    if ($('.chat-count').length === 0){
    	$('.chat-count').hide();
    }

    $('.chat-conversation-detail .chat-conversation-detail-body').empty();
    _.each(chat.conversation, function(message){
      if (message.from === "@mike"){
        var bodyClass = 'chat-conversation-detail-flip';
      }else{
        var bodyClass = '';
      }
      $('.chat-conversation-detail .chat-conversation-detail-body').append('<div class="' + bodyClass + ' position-clear-both "><div class="chat-conversation-detail-avatar" style="background: url(' + message.avatar +') 100% 100% / cover no-repeat"></div><div class="chat-conversation-detail-message">' + message.message + '</div></div>');
    });   
  }

  function loadMessages(){
    $('.chat-conversations ul').empty();

    _.each(chats, function(chat){ 
      var conversation = chat.conversation;
      var lastMessage = _.last(conversation);
      if(chat.read){
        var read = 'chat-read';
        var count = '';
      }else{
        var read = ''
        var count = '<div class="chat-message-count">1</div>';
      }
      $('.chat-conversations ul').prepend('<li class="chat-view-details ' + read + '" data-id="' + chat.id + '"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + lastMessage.avatar + ') 100% 100% / cover no-repeat">' + count + '</div><div class="chat-message"><div class="chat-name">' + lastMessage.from +  '</div><div>' + lastMessage.message + '</div></div></div></li>');
    });
  }

  function loadTransactions(){
    $('.transactions .transactions-purchases tbody').empty();

    _.each(purchases, function(purchase){ 
      $('.transactions .transactions-purchases tbody').append('<tr class="transaction-detail" data-id="' + purchase['id'] + '" data-transaction-type="purchase"><td><div class="avatar purchase-item position-float-left" style="background: url(' + purchase['item-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-item position-margin-top-15px position-margin-left-8px">' + purchase['item-name'] + '</div></td><td>' + purchase['date'] + '</td><td><div class="avatar position-float-left" style="background: url(https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPH-XfXxbxMTizvaNTCZuugMAQeOErj8-7DcjloR9MgBAw6xxuQQ) 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 item-store-name" data-store-guid="' + purchase['guid'] + '">' + purchase['vendor'] + '</div></td><td>' + purchase['price'] + '</td><td>' + purchase['status'] + '</td></tr>');
    });
  }

  function loadSales(){
    $('.transactions .transactions-sales tbody').empty();

    _.each(sales, function(sale){ 
      $('.transactions .transactions-sales tbody').append('<tr class="transaction-detail" data-id="' + sale['id'] + '" data-transaction-type="sale"><td>' + sale['id'] + '</td><td>' + sale['date'] + '</td><td><div class="avatar position-float-left" style="background: url(' + sale['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 item-store-name" data-buyer-guid="' + sale['buyer-guid'] + '">' + sale['buyer-handle'] + '</div></td><td>' + sale['price'] + '</td><td>' + sale['status'] + '</td></tr>');
    });
  }

  function loadCases(){

  }

  function startNewChat(store){
  	loadMessages();
    if ($('.chat').css('bottom') === "-310px"){
      $('.chat-count').hide();
      $('.chat-close').show();
      $('.chat').css('bottom','0px');
    }

    $('.chat-conversations ul').prepend('<li class="chat-view-details"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + store.avatar + ') 100% 100% / cover no-repeat"></div><div class="chat-message"><div class="chat-name">' + store.handle +  '</div><div></div></div></div></li>');
   
    $('.chat-conversations').scrollTop(0);
    $('.chat-conversations').css('overflow','hidden');
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-conversation-detail-body').empty();
    $('.chat-title').html('<div class="chat-view-all chat-back button-chat-control position-float-left"><</div><div class="chat-view-all position-float-left"> ' + storeHandle(store) + '</div>');
    $('.chat-avatar').not('.chat-avatar:first').fadeTo(150, 0.15);
    $('.input-chat-new-message').focus();
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

 // ##########ITEMS
 // events
  // $(document).on("mouseover", ".item", itemEnter);
  // $(document).on("mouseleave", ".item", itemLeave);
  $(document).on("click", ".item-detail-buy", function(event) { 
    $('.modal-purchase-detail').hide();
    // reset the colors
    setPrimaryColor($('body').css('bgColor').replace('#',''));
    setSecondaryColor($('#header').css('bgColor').replace('#',''));
    setTextColor($('body').css('color').replace('#',''));

    var image = $('.item-detail-image').css('background-image');
    var avatar = $('.store-avatar').css('background-image');
    var price = $('.item-detail-price span').html();
    var name = $('.store-name').html();
    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat');
    $('.modal-pretty .direct-avatar').css('background', avatar + '100% 100% / cover no-repeat');
    $('.modal-pretty .modal-item-price').html(price + ' ($52 USD)');
    $('.modal-pretty .modal-store-name').html(name);

    $('#main, .store-banner').addClass('blur');
    $('.modal-product, .modal-store-meta').hide();
    $('.overlay, .modal-trade-flow').show();
    $('.modal-pretty').fadeTo(100, 100);
  });
  $(document).on("click", ".item-meta-data, .item-image, .item-name", function(event) { 
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).data('storeGuid');
    var itemId = $(event.currentTarget).data('itemId');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    var item = _.find(store.items, function(item){ return item.id == itemId });
    stripPageHistory();
    displayItemDetail(store, item, true);
    setArrowOpacity();
  });

  // functions
  function itemEnter(event){
    $(event.currentTarget).css('background-color', 'transparent');
    $(event.currentTarget).find('.item-image').animate({top: '2px'}, 200, 'easeOutQuad');
  }

  function itemLeave(event){
    $(event.currentTarget).find('.item-image').animate({top: 0}, 200, 'easeOutQuad');
  }

  function displayItemDetail(store, item, updatePageViews){
    activePage = getActivePageType();
    setPageUrl(store.guid + '/' + item.id);

    if (updatePageViews){
      pageViews.push({"page": "item-detail", "itemid": item.id, "guid": store.guid, "active": true});
      unsetActivePage(); 
    } 

    if (item.quantity === 0){
      $('.item-detail-buy, .input-item-detail-quantity').hide();
      $('.item-detail-sold-out').show();
    }else{
      $('.item-detail-buy, .input-item-detail-quantity').show();
      $('.item-detail-sold-out').hide();
    } 

    $('.item-detail-price').html('<span class="type-weight-medium">' + item.price + ' btc</span>');
    $('.item-detail-quantity').val(1);  
    $('.store-message').attr('data-store-guid', store.guid);
    $('.store-dets').attr('data-store-guid', store.guid);

    if (item.type === "physical"){
      $('.item-detail-shipping').html('shipping: <span class="type-weight-medium">+' + item.shipping + ' btc</span>').show();
      $('.item-detail-condition').html('condition: <span class="type-weight-medium">' + item.condition + '</span>').show();
      $('.item-detail-type').hide();
      $('.item-detail-quantity').show();
      $('.item-detail-buy').html('Buy');
    }else{
      $('.item-detail-type, .item-detail-quantity, .item-detail-shipping, .item-detail-condition').hide();
      $('.item-detail-buy').html('Buy & download');
    }

    if (activePage === "store"){
      $('.store, .item-detail, .button-try-again').hide();
      $('.item-detail-name').html(item.name);
      $('.item-detail-description').html(item.description);
      $('.item-detail-image').css('background-image', 'url(' + item.photo1 + ')');
      $('.item-detail-meta').css('background', store.colorsecondary);
      $('.item-detail').fadeIn('slow');
    }else{
      $('.store, .store-banner, .store-footer, .items, .ob-icon, .button-try-again').hide();
      $('.connecting').fadeIn();
      $('.loading-icon').attr('src', store.avatar).show();
      $('.loading-message').html('Connecting to ' + storeHandle(store));
      showLoading();
      $('body, .navigation-controls, .navigation-controls span, .button-try-again, .control-panel li, .button-primary').animate({ backgroundColor: store.colorprimary, color: store.colortext }, fade);
      $('#header, .item-meta-data, .store-items .item, .store-details table, .store-banner, .store-footer, .item-detail-meta').animate({ backgroundColor: store.colorsecondary }, fade);
      setTimeout(function(){  
        if (connectToStore()){
          $('.items, .connecting').hide();
          $('.store-name').html(storeHandle(store)).attr('data-store-guid', store.guid);
          $('.store-home').attr('data-store-guid', store.guid);
          $('.store-description').html(store.description);
          $('.store-avatar').css('background-image', 'url(' + store.avatar + ')').attr('data-store-guid', store.guid);
          $('.store-banner, .store-footer').show();
          $('.item-detail-name').html(item.name);
          $('.item-detail-description').html(item.description);
          $('.item-detail-image').css('background-image', 'url(' + item.photo1 + ')');
          $('.item-detail').fadeIn('slow');
        }else{
          $('#spinner').empty().hide();
          $('.loading-message').html('Connection failed');
          $('.button-try-again').removeData().attr('data-store-guid', store.guid).attr('data-item-id', item.id).attr('data-view', "item-detail").show();
        }
      }, delay);

    }
  }



  // #############STORES
  // events
  $(document).on("click", ".store-message", function(event){
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).attr('data-store-guid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    startNewChat(store);
  });

  $(document).on("click", ".modal-purchase-dispute", function(event){
    event.stopPropagation();
    var modGuid = $(event.currentTarget).attr('data-mod-guid');
    var mod = _.find(mods, function(mod){ return mod.guid == modGuid });
    startNewChat(mod);
    $('.input-chat-new-message').attr("placeholder","What are you disputing?");
  });

  $(document).on("click", ".trade-payment-type-next", function(event){
    $('.modal-trade-flow-payment-type').hide();
    $('.modal-trade-flow-address').show();
    $('.modal-pretty .modal-header').html('Ship to');
  });

  $(document).on("click", ".trade-address-next", function(event){
    $('.modal-item').html($('.item-detail-name').html());
    $('.modal-trade-flow-address').hide();
    $('.modal-trade-flow-summary').show();
    $('.modal-pretty .modal-header').html('Summary');
    $('.modal-item-price-style, .modal-photo-shadow').hide();
    $('.modal-photo').css('background','#fff');
  });

  $(document).on("click", ".store-dets", function(event){
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).attr('data-store-guid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid });
    showStoreDetails(store);
  });


  $(document).on("click", ".item-store-name, .store-banner .store-name, .store-banner .store-avatar, .store-home", function(event) { 
    event.stopPropagation();
    var storeGuid = $(event.currentTarget).attr('data-store-guid');
    var store = _.find(stores, function(item){ return item.guid == storeGuid })
    stripPageHistory();
    displayStore(store, true, false);
    setArrowOpacity();
  });

  // functions
  function storeHandle(store){
    if (store.handle){
      var name = '@' + store.handle;
    }else{
      var name = store.name;
    }   
    return name;
  }

  function hideAllTheThings(){
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.items, .store, .ob-icon, .item-detail, .store-settings, .store-banner, .store-banner-2, .store-footer, .button-try-again, .store-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  }

  function showStoreDetails(store){
    $('.store-items, .item-detail').hide();
    $('.store-details').fadeIn();
    $('.store-details-website').html('<a href="' + store.website + '" target="_blank">' + store.website + '</a>');
    $('.store-details-email').html(store.email);
    $('.store-details-public-key').html(store.publicKey);
    $('.store-details-pledge').html(store.pledge);
    $('.store-details-pgp-key').html($.parseHTML(store.pgpKey));
  }

  function connectToStore(){
    var arr = _.shuffle([1,2,3,4,5]);
    if (_.first(arr) == 1){
      return false;
    }else{
      return true;
    }
  }
  
  function displayStore(store, updatePageViews, instant, autoConnect){
    if (instant){ delay = 0; fade = 0; } else {  delay = 1900; fade = 500; }
    $('.store-items').empty();
    if (updatePageViews){
      pageViews.push({"page": "store", "guid": store.guid, "active": true});
      unsetActivePage();
    }
    _.each(store.items, function(item, index){
      renderGridItem(store, item, '.store-items');
    });

    hideAllTheThings();
    $('.connecting').fadeIn();
    $('.loading-icon').attr('src', store.avatar).show();
    $('.store-message').attr('data-store-guid', store.guid);
    $('.loading-message').html('Connecting to ' + storeHandle(store));
    showLoading();
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary').animate({ backgroundColor: store.colorprimary, color: store.colortext }, fade);
    $('.item-meta-data, .item-price').animate({ color: store.colortext }, fade);
    $('#header, .item-meta-data, .item-image, .store-items .item, .store-banner, .store-details table').animate({ backgroundColor: store.colorsecondary }, fade);
    setTimeout(function(){  
      if (connectToStore() ||  autoConnect){
        $('.items, .connecting').hide();
        $('.store-items, .store-buttons').show();
        $('.store-name').html(storeHandle(store)).attr('data-store-guid', store.guid);
        $('.store-home').attr('data-store-guid', store.guid);
        $('.store-dets').attr('data-store-guid', store.guid);
        $('.store-description').html(store.description);
        $('.store-avatar').css('background-image', 'url(' + store.avatar + ')').attr('data-store-guid', store.guid);
        $('.store-banner, .store-footer').show();
        if (instant){
          $('.store').show();
        }else{
          $('.store').fadeIn('slow');
        }
      }else{
        $('#spinner').empty().hide();
        $('.loading-message').html('Connection failed');
        $('.button-try-again').removeData().attr('data-store-guid', store.guid).attr('data-view', "item-detail").attr('data-view', "store").show();
      }
    }, delay);
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
  // $(document).on("click", ".settings-item", function(event) {
  //   var id = $(event.currentTarget).data('id');
  //   loadProduct(id);
  // });
  $(document).on("click", ".store-settings-cancel", function(event) {
    displayHome(false, true);
    setPageUrl();    
  });

  function createStore(){
    stores.push($store);
    var tmpStore = findStore($('.store-meta-handle').val().replace('@',''));
    displayStore(tmpStore, true, false);
    setPageUrl(tmpStore.guid);   
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