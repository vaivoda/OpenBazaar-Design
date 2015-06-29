$(function() {
  window.Chat.initialize();
});

window.Chat = {
  initialize: function() {
    $(document).on('click', '.chat-condensed, .chat-condensed-title, .chat-close, .chat-header', function(){ Chat.toggle(event) });
    $(document).on('click', '.chat-view-all', function(){ Chat.viewAll() });
    $(document).on('click', '.chat-message', function(event){ 
      var id = $(event.currentTarget).parent().parent().data('id');
      Chat.viewDetails(id);
    });
    $(document).on("click", ".chat-avatar", function(event){
      var id = $(event.currentTarget).parent().parent().data('id');
      Chat.viewDetails(id);
    });
    $(document).on("click", ".vendor-message", function(event){
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Chat.startNewChat(Vendor.find(vendorGuid));
    });
    $(document).on("click", ".modal-purchase-dispute", function(event){
      event.stopPropagation();
      var modGuid = $(event.currentTarget).attr('data-mod-guid');
      var mod = _.find(mods, function(mod){ return mod.guid == modGuid });
      Chat.startNewChat(mod);
      $('.input-chat-new-message').attr("placeholder","What are you disputing?");
    });
  },

  find: function find(id) {
    return _.find(chats, function(chat){ return chat.id == id })
  },

  loadMessages: function loadMessages(){
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

      if(lastMessage){
        $('.chat-conversations ul').append('<li class="chat-view-details ' + read + '" data-id="' + chat.id + '"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + lastMessage.avatar + ') 100% 100% / cover no-repeat">' + count + '</div><div class="chat-message"><div class="chat-name">' + lastMessage.from +  '</div><div>' + lastMessage.message + '</div></div></div></li>');
      }
    });
  },

  newConversation: function newConversation(vendor){
    var chat = {
      "id": vendor.id,
      "read": true,
      "incoming": false,
      "from": "@mike",
      "to": Vendor.handle(vendor),
      "date": "",
      "conversation": []
    };
    chats.push(chat);
    Chat.saveMessage();
  },

  saveMessage: function saveMessage(){
    var id = $('.input-chat-new-message').attr('data-id');
    console.log(id);
    var chat = Chat.find(id);
    var newMessage = {
      "from": "@mike",
      "message": $('.input-chat-new-message').val(),
      "avatar": "https://lh4.googleusercontent.com/--248Dl6ElQU/AAAAAAAAAAI/AAAAAAAAAAA/BX_O_7Ha0fI/s128-c-k/photo.jpg"
    }
    chat.conversation.push(newMessage);
    $('.input-chat-new-message').val('');
    $('.chat-conversation-detail-body').scrollTop($('.chat-conversation-detail-body')[0].scrollHeight);
    Chat.viewDetails(id);
  },

  startNewChat: function startNewChat(vendor){
    Chat.loadMessages();
    if ($('.chat').css('bottom') === "-310px"){
      $('.chat-count').hide();
      $('.chat-close').show();
      $('.chat').css('bottom','0px');
    }

    $('.chat-conversations ul').prepend('<li class="chat-view-details"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + vendor.avatar + ') 100% 100% / cover no-repeat"></div><div class="chat-message"><div class="chat-name">' + vendor.handle +  '</div><div></div></div></div></li>');
    $('.chat-conversations').scrollTop(0);
    $('.chat-conversations').css('overflow','hidden');
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-conversation-detail-body').empty();
    $('.chat-title').html('<div class="chat-view-all chat-back button-chat-control position-float-left"><</div><div class="chat-view-all position-float-left"> ' + Vendor.handle(vendor) + '</div>');
    $('.chat-avatar').not('.chat-avatar:first').fadeTo(150, 0.15);
    $('.input-chat-new-message').focus();
  },
  
  toggle: function toggle(event){
    event.stopPropagation();
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
      if ($(event.currentTarget).hasClass('chat-header')){
        Chat.viewAll();
      }else{
        Chat.viewAll();
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
  },

  viewAll: function viewAll(){
    $('.chat-message').show();
    $('.chat-conversation-detail').hide();
    $('.chat-avatar').fadeTo(0, 1);
    $('.chat-conversations').css('overflow-y','scroll');
    $('.chat-title').html('Messages');
  },

  viewDetails: function viewDetails(id){
    var chat = Chat.find(id);
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
}