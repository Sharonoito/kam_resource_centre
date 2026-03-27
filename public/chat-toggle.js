document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('kam-chat-toggle');
  const chatFrame = document.getElementById('kam-chat-frame');
  if (!toggleBtn || !chatFrame) return;
  let isOpen = false;
  toggleBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    chatFrame.style.display = isOpen ? 'block' : 'none';
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      chatFrame.style.display = 'none';
      isOpen = false;
    }
  });
});
