$(function(){
	// events
  $(document).on("click", ".chat-condensed, .chat-condensed-title, .chat-close", toggleChat);
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
    if ($('.chat-condensed').is(':visible')){
      $('.chat-condensed').hide();
      $('.chat-expanded').show();
    }else{
      $('.chat-condensed').show();
      $('.chat-expanded').hide();
      $('.chat-message').show();
      $('.chat-conversation-detail').hide();
      $('.chat-avatar').fadeTo(0, 1);
    }
  }

  function chatViewAll(){
    $('.chat-view-all').hide();
    $('.chat-message').show();
    $('.chat-conversation-detail').hide();
    $('.chat-avatar').fadeTo(0, 1);
    $('.chat-expanded').css('overflow-y','scroll');
  }

  function viewChatDetails(id, e){
    var chat = _.find(chats, function(chat){ return chat.id == id });
    $('.chat-view-details[data-id=' + id + ']').addClass('chat-read');
    $('.chat-expanded').scrollTop(0);
    $('.chat-expanded').css('overflow','hidden');
    $('.chat-view-all').show();
    $('.input-chat-new-message').val('');
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-view-details').not( '[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 0.10);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 1);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-message-count').remove();
    $('.input-chat-new-message').focus();
    $('.chat-conversation-detail-title').html(chat.from);
    $('.input-chat-new-message').attr('data-id', id);

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
    $('.chat-expanded-conversations ul').empty();
    $('.chat-expanded').css('overflow-y','scroll');

    _.each(chats.reverse(), function(chat){
      var conversation = chat.conversation;
      var lastMessage = _.last(conversation);
      if(chat.read){
        var read = 'chat-read';
        var count = '';
      }else{
        var read = ''
        var count = '<div class="chat-message-count">1</div>';
      }
      $('.chat-expanded-conversations ul').append('<li class="chat-view-details ' + read + '" data-id="' + chat.id + '"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + lastMessage.avatar + ') 100% 100% / cover no-repeat">' + count + '</div><div class="chat-message"><div class="chat-name">' + lastMessage.from +  '</div><div>' + lastMessage.message + '</div></div></div></li>');
    });
    $('.chat-expanded-conversations ul').append('<li class="chat-view-all visibility-hidden"><div class="chat-holder"><div class="chat-view-all-back"><</div></div></div></li>');
  }

  function startNewChat(store){
    var chat = {
      "id": store.id,
      "read": true,
      "incoming": false,
      "from": "@mike",
      "to": store.storeHandle,
      "date": "",
      "conversation": []
    };
    chats.push(chat);
    loadMessages();
  }
})