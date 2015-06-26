$(function() {
  window.Cases.initialize();
});

window.Cases = {
  initialize: function() {
  },

  display: function display(){
    Cases.load();
    $('.transactions-h1').html('Cases');
    $('.transactions-purchases, .transactions-sales').hide();
    $('.transactions .transactions-cases').show();
  },

  load: function load(){
  },
}