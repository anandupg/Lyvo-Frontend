// Debug script to help identify frontend issues
console.log('🔍 Frontend Chat Debug Information');
console.log('=====================================');

// Check localStorage
console.log('📱 Local Storage Data:');
console.log('- User:', localStorage.getItem('user'));
console.log('- Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing');

// Parse user data
try {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('👤 User Details:');
  console.log('- ID:', userData.id || userData._id);
  console.log('- Name:', userData.name);
  console.log('- Email:', userData.email);
  console.log('- Role:', userData.role);
} catch (error) {
  console.error('❌ Error parsing user data:', error);
}

// Test chat service connection
console.log('\n🔌 Testing Chat Service Connection...');
const chatServiceUrl = 'http://localhost:3004';

fetch(chatServiceUrl)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Chat service is accessible:', data.message);
    
    // Test getUserChats if we have user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id || userData._id;
    const token = localStorage.getItem('authToken');
    
    if (userId && token) {
      console.log('\n📞 Testing getUserChats API...');
      console.log('- User ID:', userId);
      console.log('- Token present:', !!token);
      
      fetch(`${chatServiceUrl}/api/chat/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('- API Response Status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('- API Response:', data);
        if (data.success) {
          console.log(`✅ Found ${data.data.chats.length} chats`);
          data.data.chats.forEach((chat, index) => {
            console.log(`  Chat ${index + 1}:`, {
              chatId: chat.chatId,
              otherParticipant: chat.otherParticipant?.name,
              lastMessage: chat.lastMessage?.content,
              unreadCount: chat.unreadCount
            });
          });
        } else {
          console.log('❌ API Error:', data.message);
        }
      })
      .catch(error => {
        console.error('❌ API Error:', error);
      });
    } else {
      console.log('⚠️  Cannot test getUserChats - missing user ID or token');
    }
  })
  .catch(error => {
    console.error('❌ Chat service connection failed:', error);
  });

console.log('\n💡 Debug Tips:');
console.log('1. Check if user ID matches the seeker ID in database');
console.log('2. Verify JWT token is valid and not expired');
console.log('3. Check browser console for any JavaScript errors');
console.log('4. Ensure chat service is running on port 3004');
console.log('5. Check CORS settings if getting network errors');
