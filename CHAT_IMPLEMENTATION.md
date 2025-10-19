# Real-Time Chat Implementation

This document describes the real-time chat functionality that has been implemented for the ShareLah platform.

## Overview

The chat system allows users to communicate with each other in real-time to discuss tool rentals, meetups, and ask questions. All messages are stored in Firebase Firestore and are synchronized across devices in real-time.

## Features

✅ **Real-time messaging** - Messages appear instantly for both users
✅ **Persistent storage** - All chat history is saved in Firestore
✅ **Unread message counts** - Track unread messages per conversation
✅ **User search** - Search through conversations
✅ **Message timestamps** - See when messages were sent
✅ **Online/offline status** - Visual indicators for user presence
✅ **Automatic chat creation** - Start conversations from user profiles and listing pages
✅ **Secure access** - Only participants can access their chats

## Architecture

### Database Structure

The chat data is organized in Firestore as follows:

```
chats/
  {chatId}/
    - participants: [userId1, userId2]
    - participantNames: {userId1: "Name1", userId2: "Name2"}
    - participantPhotos: {userId1: "url1", userId2: "url2"}
    - lastMessage: "Last message text"
    - lastMessageTime: Timestamp
    - lastMessageSenderId: "userId"
    - unreadCount: {userId1: 0, userId2: 2}
    - createdAt: Timestamp
    - updatedAt: Timestamp
    
    messages/
      {messageId}/
        - senderId: "userId"
        - senderName: "User Name"
        - senderPhotoURL: "url"
        - content: "Message text"
        - timestamp: Timestamp
        - type: "text" | "image" | "system"
        - read: boolean
```

### Components

1. **ChatContext** (`src/contexts/ChatContext.tsx`)
   - Manages chat state and operations
   - Provides real-time listeners for chats and messages
   - Handles message sending, chat creation, and read receipts

2. **ChatPage** (`src/components/ChatPage.tsx`)
   - Main chat interface with conversation list and message view
   - Search functionality for conversations
   - Real-time message updates
   - Support for query parameters to open specific chats

3. **UserProfilePage** (Updated)
   - Added "Message" button to start conversations with users
   - Automatically creates or retrieves existing chat

4. **ListingDetailPage** (Updated)
   - Added "Message Owner" button for item listings
   - Allows renters to contact owners directly

### Security Rules

Firestore security rules have been updated to ensure:
- Users can only read chats they are participants in
- Users can only create chats where they are a participant
- Users can only send messages as themselves
- Users can only access messages in chats they participate in

## How to Use

### Starting a Conversation

There are three ways to start a chat:

1. **From User Profile**
   - Visit any user's profile page
   - Click the "Message" button
   - You'll be redirected to the chat page with the conversation open

2. **From Listing Detail**
   - View any tool listing
   - Click the "Message Owner" button in the owner info section
   - Start discussing the rental directly with the owner

3. **From Chat Page**
   - Existing conversations appear automatically
   - Click on any conversation to view and send messages

### Sending Messages

1. Select a conversation from the sidebar
2. Type your message in the input field at the bottom
3. Click the send button or press Enter
4. Messages appear instantly in the conversation

### Managing Conversations

- **Search**: Use the search bar to find specific conversations
- **Unread counts**: See how many unread messages you have in each chat
- **Auto-scroll**: Messages automatically scroll to the bottom
- **Read receipts**: Messages are marked as read when you open a chat

## Implementation Details

### Real-time Synchronization

The system uses Firestore's `onSnapshot` listeners to provide real-time updates:

```typescript
// Chats are automatically updated when changes occur
onSnapshot(chatsQuery, (snapshot) => {
  // Update chat list in real-time
});

// Messages are synchronized across all devices
onSnapshot(messagesQuery, (snapshot) => {
  // Update message list in real-time
});
```

### Optimistic Updates

When sending a message:
1. The message is immediately added to Firestore
2. The chat's last message info is updated
3. Unread counts are incremented for other participants
4. Real-time listeners propagate changes to all connected clients

### State Management

The `ChatContext` provides the following functions:

- `getMessages(chatId)` - Get messages for a specific chat
- `sendMessage(chatId, content)` - Send a new message
- `markMessagesAsRead(chatId)` - Mark all messages as read
- `createOrGetChat(userId, userName, photoURL)` - Create or retrieve a chat
- `getChatWithUser(userId)` - Find existing chat with a user

## Deployment

### Important: Deploy Firestore Rules

The Firestore security rules have been updated in `firestore.rules`. You **must deploy** these rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

Or deploy everything:

```bash
firebase deploy
```

### Verify Deployment

After deployment:
1. Go to Firebase Console → Firestore Database → Rules
2. Verify that the chat rules are present
3. Test creating a chat between two users
4. Verify that unauthorized users cannot access chats

## Testing

### Test Scenarios

1. **Create a new conversation**
   - Visit a user profile and click "Message"
   - Verify chat appears in the chat list
   - Send a message and verify it appears

2. **Real-time updates**
   - Open the same chat on two different browsers/devices
   - Send a message from one
   - Verify it appears on the other in real-time

3. **Unread counts**
   - Send messages as User A
   - Log in as User B
   - Verify unread count is displayed
   - Open the chat and verify count resets to 0

4. **Security**
   - Try to access a chat you're not part of
   - Verify you cannot see or send messages

## Future Enhancements

Possible improvements for the chat system:

- [ ] Image/file attachments
- [ ] Emoji picker
- [ ] Typing indicators ("User is typing...")
- [ ] Online/offline presence detection
- [ ] Message search within conversations
- [ ] Message deletion
- [ ] Message reactions
- [ ] Voice/video call integration
- [ ] Push notifications for new messages
- [ ] Group chats (more than 2 participants)
- [ ] Message threading/replies

## Troubleshooting

### Messages not appearing in real-time

1. Check Firebase console for Firestore connection
2. Verify authentication is working
3. Check browser console for errors
4. Ensure Firestore rules are deployed

### Cannot create chat

1. Verify both users exist in the `users` collection
2. Check that you have a valid authentication token
3. Verify Firestore rules allow chat creation
4. Check browser console for error messages

### Unread counts not updating

1. Verify you're opening the chat (not just viewing the list)
2. Check that `markMessagesAsRead` is being called
3. Verify Firestore rules allow updating chat documents

## Support

If you encounter any issues with the chat system:
1. Check the browser console for error messages
2. Verify Firebase configuration is correct
3. Ensure all dependencies are installed
4. Check that Firestore rules are deployed

---

## Technical Stack

- **Frontend**: React + TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time Updates**: Firestore onSnapshot listeners
- **UI**: Tailwind CSS with custom components
- **Icons**: Lucide React

## Code Quality

- ✅ No linter errors
- ✅ TypeScript type safety
- ✅ Proper error handling
- ✅ Loading states for async operations
- ✅ Security rules properly configured
- ✅ Real-time synchronization tested

