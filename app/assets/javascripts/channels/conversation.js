App.conversation = App.cable.subscriptions.create("ConversationChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {
    var conversation = $('#conversations-list').find("[data-conversation-id='" + data['conversation_id'] + "']");

    if (data['window'] !== undefined) {
      var conversation_visible = conversation.is(':visible');

      if (conversation_visible) {
        var messages_visible = (conversation).find('.card-body').is(':visible');

        if (!messages_visible) {
          conversation.removeClass('card').addClass('card bg-success');
        }
        conversation.find('.messages-list').find('ul').append(data['message']);
      } else {
        $('#conversations-list').append(data['window']);
        conversation = $('#conversations-list').find("[data-conversation-id='" + data['conversation_id'] + "']");
        conversation.find('.card-body').toggle();
        conversation.find('.card-footer').toggle();        
      }
    } else {
      conversation.find('ul').append(data['message']);
    }

    var messages_list = conversation.find('.messages-list');
    console.log(messages_list)
    var height = messages_list[0].scrollHeight;
    messages_list.parent().scrollTop(height);
    $.ajax({url: '/conversations', dataType: "script"});

  },
  speak: function(message) {
    return this.perform('speak', {
      message: message
    });
  }
});
$(document).on('submit', '.new_message', function(e) {
  e.preventDefault();
  var values = $(this).serializeArray();
  App.conversation.speak(values);
  $(this).trigger('reset');
});