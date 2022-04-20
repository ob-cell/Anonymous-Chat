(function() {
    var chatBox = document.querySelector('.chat-box');
    var inputBox = document.querySelector('.input-box');
    var chatForm = document.querySelector('.chat-form');
    
    function addMessage(text) {
        var newMessage = document.createElement('div');
        newMessage.textContent = text;
        chatBox.insertBefore(newMessage, chatBox.firstChild);
    }
    
    chatForm.addEventListener('submit', function(event) {
        if (inputBox.value.trim()) {
            addMessage(inputBox.value);     
            inputBox.value = '';            
        }
        event.preventDefault();
    });
})();
