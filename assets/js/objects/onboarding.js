$(function() {
  window.Onboarding.initialize();
});

window.Onboarding = {
  initialize: function() {
    $(document).on("click", ".onboarding-button-start, .onboarding-button-next, .onboarding-button-skip", function(event){ Onboarding.next(event) });
    $(document).on("click", ".onboarding-button-back", function(event){ Onboarding.back(event) });
    $(document).on("click", ".onboarding-button-close", function(event){ Onboarding.close(event) });
  },

  close: function close(){
    Helper.setDefualtColors();
    $('.onboarding').hide();
    $('.connecting').show();
    Connect.load();
    Chat.loadMessages();
    Navigation.setArrowOpacity();  
    setTimeout(function(){ Discover.populateFeed() }, delay);
  },

  loadContributors: function loadContributors(){
    _.each(contributors, function(person, index){
      $('.onboarding-contributors-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-12px user-profile-link" data-user-handle="' + person.handle + '">' + person.name + ' <div class="type-opacity position-margin-top-2px">' + person.handle + '</div></div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
  },

  back: function back(){
    var step = $('.onboarding').attr('data-active-step');
    $('.onboarding-step, .onboarding-button-start, .onboarding-button-next, .onboarding-button-back, .onboarding-button-skip, .onboarding-button-close').hide();
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
      case "user-role":
        Onboarding.renderTimeZone();
        break;
      case "bitcoin-address":
        Onboarding.renderUserRole();
        break;
      case "handle":
        Onboarding.renderBitcoinAddress();
        break;
      case "avatar":
        Onboarding.renderHandle();
        break;
      case "final":
        Onboarding.renderAvatar();
        break;
    }
  },

  next: function next(){
    var step = $('.onboarding').attr('data-active-step');
    $('.onboarding-step, .onboarding-button-start, .onboarding-button-next, .onboarding-button-back, .onboarding-button-skip, .onboarding-button-close').hide();
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
        Onboarding.renderUserRole();
        break;
      case "user-role":
        Onboarding.renderBitcoinAddress();
        break;
      case "bitcoin-address":
        Onboarding.renderHandle();
        break;
      case "handle":
        Onboarding.renderAvatar();
        break;
      case "avatar":
        Onboarding.renderFinal();
        break;
    }
  },

  renderContributors: function renderContributors(){
    Onboarding.setTitle('Contributors');
    $('.onboarding-contributors, .onboarding-button-start').show();
    $('.onboarding').attr('data-active-step', 'contributors');   
  },

  renderLocation: function renderLocation(){
    Onboarding.setTitle('Select your country');
    $('.onboarding-location, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'location');   
  },

  renderCurrency: function renderCurrency(){
    Onboarding.setTitle('Select your local currency');
    $('.onboarding-currency, .onboarding-button-back, .onboarding-button-next').show();
    $('.onboarding').attr('data-active-step', 'currency'); 
  },

  renderTimeZone: function renderTimeZone(){
    Onboarding.setTitle('Select your time zone');
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
  },

  renderHandle: function renderHandle(){
    Onboarding.setTitle('Handle');
    $('.onboarding-handle, .onboarding-button-back, .onboarding-button-skip').show();
    $('.onboarding').attr('data-active-step', 'handle');
  },

  renderAvatar: function renderAvatar(){
    Onboarding.setTitle('Avatar');
    $('.onboarding-avatar, .onboarding-button-back, .onboarding-button-skip').show();
    $('.onboarding').attr('data-active-step', 'avatar');
  },

  renderFinal: function renderFinal(){
    Onboarding.setTitle('You\'re all set');
    $('.onboarding-final, .onboarding-button-back, .onboarding-button-close').show();      
    $('.onboarding').attr('data-active-step', 'final');
  },

  setTitle: function setTitle(title){
    $('.onboarding-header').html(title);
  },

  show: function show(){
    Onboarding.loadContributors();
    $('body').css('background', '#2A2A2A')
    $('.onboarding').fadeTo(100,100);
  }
}