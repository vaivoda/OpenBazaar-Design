$(function() {
  window.Modal.initialize();
});

window.Modal = {
  initialize: function() {
    $(document).on("click", ".overlay, .close-modal, .trade-close", function(){ Modal.close() });
    $(document).on("click", ".modal-navigation li", function(event){ Modal.setActiveTab(event) });
  },

  clear: function clear(){
    $('.modal input, .modal textarea').val('');
  },

  close: function close(){
    $('.modal-pretty, .modal').fadeTo(150, 0, function(){
      $('#main, .vendor-banner, .vendor-banner-2, .chat').removeClass('blur');
      $('.modal-pretty, .modal').hide();
      $('.overlay').hide();
      $('.chat').show();
    });    
  },

  setActiveTab: function setActiveTab(event){
    var target = $(event.currentTarget);
    var section = target.data('section');
    $('.modal-navigation ul li').removeClass('modal-navigation-selected');
    target.addClass('modal-navigation-selected');
    $('.modal-purchase-detail .modal-body table').hide();
    $('.' + section).show();
  },

  setTitle: function setTitle(title){
    $('.modal-pretty .modal-header').html(title);
  },

  show: function show(type){
    if (type === "basic"){
      $('.modal').fadeTo(100, 100); 
    }else{
      $('.modal-pretty').fadeTo(100, 100); 
    }
  },
}