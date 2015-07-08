$(function() {
  window.Onboarding.initialize();
});

window.Onboarding = {
  initialize: function() {
    $(document).on("click", ".onboarding-button-start, .onboarding-button-next, .onboarding-button-skip", function(event){ Onboarding.next(event) });
    $(document).on("click", ".onboarding-button-back", function(event){ Onboarding.back(event) });
    $(document).on("click", ".onboarding-button-close", function(event){ Onboarding.close(event) });
    $(document).on("click", ".onboarding-choose-avatar, .avatar-circle", function(event){  
      $('.onboarding-input-avatar').click();
      $('.onboarding-button-skip').hide();
      $('.onboarding-button-next').show();
    });
    $(document).on("click", ".connect-to-onename", function(event){ 
      $('.onboarding-button-skip').hide();
      $('.onboarding-button-next').show();
      alert("Don't know how this is going to work yet =/");
    });
    $(".onboarding-input-avatar").change(function (){
       Helper.readURL(this);
     });
  },

  close: function close(){
    Helper.setDefualtColors();
    $('.onboarding').hide();
    $('.connecting, .chat').show();
    Connect.load();
    Chat.loadMessages();
    Navigation.setArrowOpacity();  
    setTimeout(function(){ Discover.populateFeed() }, delay);
  },

  loadContributors: function loadContributors(){
    $('.onboarding-contributors-list').empty();
    _.each(contributors, function(person, index){
      $('.onboarding-contributors-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-12px" data-user-handle="' + person.handle + '">' + person.name + ' <div class="type-opacity position-margin-top-2px">' + person.handle + '</div></div></td></tr>');
      // <td class=""><button class="button-primary position-float-right">Follow</button></td>
    });
  },

  back: function back(){
    var step = $('.onboarding').attr('data-active-step');
    $('.onboarding-step, .onboarding-button-start, .onboarding-button-next, .onboarding-button-back, .onboarding-button-skip, .onboarding-button-close').hide();
    $('.onboarding-body').scrollTop(0);
    switch(step){
      case "location":
        Onboarding.renderContributors();
        break;
      case "currency":
        Onboarding.renderLocation();
        break;
      case "timezone":
        Onboarding.renderCurrency();
        break;
      // case "user-role":
      //   Onboarding.renderTimeZone();
      //   break;
      case "bitcoin-address":
        Onboarding.renderCurrency();
        break;
      case "handle":
        Onboarding.renderBitcoinAddress();
        break;
      case "avatar":
        Onboarding.renderHandle();
        break;
      // case "final":
      //   Onboarding.renderAvatar();
      //   break;
    }
  },

  next: function next(){
    var step = $('.onboarding').attr('data-active-step');
    $('.onboarding-step, .onboarding-button-start, .onboarding-button-next, .onboarding-button-back, .onboarding-button-skip, .onboarding-button-close').hide();
    $('.onboarding-body').scrollTop(0);
    switch(step){
      case "contributors":
        Onboarding.renderLocation();
        break;
      case "location":
        Onboarding.renderCurrency();
        break;
      case "currency":
        Onboarding.renderTimeZone();
        break;
      case "timezone":
        Onboarding.renderBitcoinAddress();
        break;
      // case "user-role":
      //   Onboarding.renderBitcoinAddress();
      //   break;
      case "bitcoin-address":
        Onboarding.renderHandle();
        break;
      case "handle":
        Onboarding.renderAvatar();
        break;
      // case "avatar":
      //   Onboarding.renderFinal();
      //   break;
    }
  },

  renderContributors: function renderContributors(){
    Onboarding.setTitle('Contributors');
    $('.onboarding-contributors, .onboarding-button-start').show();
    $('.onboarding').attr('data-active-step', 'contributors');   
  },

  renderLocation: function renderLocation(){
    $('.onboarding-location-list').empty();
    Onboarding.setTitle('Country');
    _.each(countries, function(country, index){
      $('.onboarding-location-list').append('<tr><td class="position-padding-15px"><input type="radio" id="' + country + '" name="country" /> <label class="position-margin-left-12px" for="' + country + '">' + country + '</td></tr>');
    });
    $('.onboarding-location, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'location');   
    $('.onboarding-location-search').focus();
  },

  renderCurrency: function renderCurrency(){
    $('.onboarding-currency-list').empty();
    Onboarding.setTitle('Local currency');
    _.each(currencies, function(currency, index){
      $('.onboarding-currency-list').append('<tr><td class="position-padding-15px"><input type="radio" id="' + currency + '" name="currency" /> <label class="position-margin-left-12px" for="' + currency + '">' + currency + '</td></tr>');
    });
    $('.onboarding-currency, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'currency'); 
    $('.onboarding-currency-search').focus();

  },

  renderTimeZone: function renderTimeZone(){
    $('.onboarding-timezone-list').empty();
    Onboarding.setTitle('Time zone');
    _.each(timeZones, function(time, index){
      $('.onboarding-timezone-list').append('<tr><td class="position-padding-15px"><input type="radio" id="' + time + '" name="time" /> <label class="position-margin-left-12px" for="' + time + '">' + time + '</td></tr>');
    });
    $('.onboarding-timezone, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'timezone'); 
  },

  renderUserRole: function renderUserRole(){
    Onboarding.setTitle('User role');
    $('.onboarding-user-role, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'user-role');
  },

  renderBitcoinAddress: function renderBitcoinAddress(){
    Onboarding.setTitle('Bitcoin address');
    $('.onboarding-bitcoin-address, .onboarding-button-back, .onboarding-button-skip').show();
    $('.onboarding').attr('data-active-step', 'bitcoin-address');
    $('.bitcoin-address').focus();
  },

  renderHandle: function renderHandle(){
    Onboarding.setTitle('Handle');
    $('.onboarding-handle, .onboarding-button-back, .onboarding-button-skip').show();
    $('.onboarding').attr('data-active-step', 'handle');
  },

  renderAvatar: function renderAvatar(){
    Onboarding.setTitle('Avatar');
    $('.onboarding-avatar, .onboarding-button-back, .onboarding-button-close').show();
    $('.onboarding').attr('data-active-step', 'avatar');
  },

  renderFinal: function renderFinal(){
    Onboarding.setTitle('Enjoy OpenBazaar');
    $('.onboarding-final, .onboarding-button-back, .onboarding-button-close').show();      
    $('.onboarding').attr('data-active-step', 'final');
  },

  setTitle: function setTitle(title){
    $('.onboarding-header').html(title);
  },

  show: function show(){
    Onboarding.loadContributors();
    $('body').css('background', '#0B4564')
    setTimeout(function(){ $('.onboarding').fadeTo(100,100) }, 500);
  }
}