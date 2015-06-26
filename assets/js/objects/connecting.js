$(function() {
  window.Connecting.initialize();
});

window.Connecting = {
  initialize: function() {
    $(document).on("click", ".button-try-again", function(event){ Connecting.tryAgain(event) });
  },

  connectToVendor: function connectToVendor(){
    var arr = _.shuffle([1,2,3,4,5]);
    if (_.first(arr) == 1){
      return false;
    }else{
      return true;
    }
  },

  load: function load(){
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
  },

  tryAgain: function tryAgain(instant){
    event.stopPropagation();
    var vendorGuid = $(event.currentTarget).data('vendorGuid');
    var contractId = $(event.currentTarget).data('contractId');
    var view = $(event.currentTarget).data('view');
    var vendor = _.find(vendors, function(vendor){ return vendor.guid == vendorGuid });
    var item = _.find(vendor.contracts, function(contract){ return contract.id == contractId });
    switch(view){
      case "store":
        Vendor.displayItems(vendor, false, false);
        break;
      case "item-detail":
        Item.renderItemDetail(vendor, item, false);
        break;
    }
    Navigation.stripPageHistory();
    Navigation.setArrowOpacity();
  }  
}