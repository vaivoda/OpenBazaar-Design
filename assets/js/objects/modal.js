$(function() {
  window.Modal.initialize();
});

window.Modal = {
  initialize: function() {
  },

  basic: function basic(){
    $('.modal').fadeTo(100, 100);    
  },

  close: function close(){
    $('.modal, .modal-pretty').fadeTo(100, 0);
  },

  pretty: function pretty(){
    $('.modal-pretty').fadeTo(100, 100);
  },

  setTitle: function setTitle(title){
    $('.modal-pretty .modal-header').html(title);
  }
}