$(function() {
  window.User.initialize();
});

window.User = {
  initialize: function() {
    $(document).on("click", ".menu-user-profile, .user-profile-link", function(event){ 
      var handle = $(event.currentTarget).attr('data-user-handle');
      var user = User.find(handle);
      User.view(user, true); 
    });
    $(document).on("click", ".user-profile-navigation li", function(event){ User.changeSection(event) });
  },
  
  find: function find(handle){  
    return _.find(users, function(user){ return user.handle == handle });
  },  

  changeSection: function changeSection(event){
    $('.user-profile-navigation li').removeClass('user-profile-navigation-selected');
    $(event.currentTarget).addClass('user-profile-navigation-selected');
    var section = $(event.currentTarget).attr('data-section');
    var handle = $(event.currentTarget).attr('data-user-handle');
    var user = User.find(handle);

    switch(section){
      case "user-profile-about": 
        $('.user-profile-following').hide();
        $('.user-profile-about').show();
        break;
      case "user-profile-following":
        User.loadFollowing(user);
        $('.user-profile-about').hide();
        $('.user-profile-following').show();
        break;
    }

    User.setPrimaryColor(user.colorprimary); 
    User.setSecondaryColor(user.colorsecondary); 
    User.setTextColor(user.colortext); 
    $('.user-profile-navigation li:not(.user-profile-navigation-selected)').css('background', user.colorsecondary);
  },

  loadFollowing: function loadFollowing(user){
    $('.user-profile-following').empty();
    _.each(user.following, function(person, index){
      $('.user-profile-following').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-profile-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
  },

  setPrimaryColor: function setPrimaryColor(hex){  
    hex = hex.replace('#','');
    $('.navigation-controls, .vendor-navigation-selected, .navigation-controls span, .control-panel li, .button-primary, .user-profile, .user-profile-navigation-selected').css('background-color', '#' + hex);
    $('.user-profile .button-first').css('border-right-color', hex);
    $('body').css('background', '#2A2A2A');
  },

  setSecondaryColor: function setSecondaryColor(hex){  
    hex = hex.replace('#','');
    $('#header, .user-profile-footer, .user-profile-navigation, .user-profile input, .user-profile select, .user-profile textarea').css('background-color', '#' + hex);
    $('.user-profile table td').css('border-bottom-color', hex);
    $('.user-profile-navigation li:not(.user-profile-navigation-selected)').css('background', hex);
  },

  setTextColor: function setTextColor(hex){  
    hex = hex.replace('#','');
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, .user-profile input, .user-profile select, .user-profile textarea, .user-profile input, .user-profile select, .user-profile textarea, .user-profile button').css('color',  '#' + hex);
    $('.user-configuration-font-color').css('background-color', '#' + hex);
    $('.settings-add-new').css('border-color', '#' + hex);
  },

  view: function view(user, updatePageViews){
    if (updatePageViews){
      pageViews.push({"page": "user", "id": user.id, "handle": user.handle, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    $('.user-profile-following').empty();
    User.setPrimaryColor(user.colorprimary);
    User.setSecondaryColor(user.colorsecondary);
    User.setTextColor(user.colortext);
    Helper.hideAll();
    $('.user-profile-navigation li:not(.user-profile-navigation-selected)').css('background', user.colorsecondary);
    $('.input-search').val(user.handle);
    $('.user-profile-navigation ul li, .user-profile-message').attr('data-user-handle', user.handle);
    $('.user-profile').fadeTo(100, 100);
    $('.user-profile-photo').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    $('.user-profile-avatar').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    $('.user-profile-about').html(user.description);
    $('.user-profile-handle').html(user.handle);
  }

}