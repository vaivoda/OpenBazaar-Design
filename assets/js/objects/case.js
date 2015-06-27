$(function() {
  window.Case.initialize();
});

window.Case = {
  initialize: function() {
  },

  display: function display(){
    Case.load();
    $('.transactions-h1').html('Cases');
    $('.transactions-purchases, .transactions-sales').hide();
    $('.transactions .transactions-cases').show();
  },

  load: function load(){
  },
}