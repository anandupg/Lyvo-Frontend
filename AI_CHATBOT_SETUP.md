# Google Gemini Pro AI Chatbot Integration for Lyvo+

This document explains how to set up and configure the AI-powered chatbot for the Lyvo+ co-living platform using Google Gemini Pro.

## Overview

The chatbot uses Google Gemini Pro AI model to provide intelligent, context-aware responses about co-living services, room rentals, and PG accommodations.

## Setup Instructions

### 1. Google Gemini Pro Integration

The chatbot is now integrated with Google Gemini Pro AI model:
- **Model**: Google Gemini Pro
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Rate Limit**: 15 requests per minute (free tier)
- **API Key**: Pre-configured and ready to use

### 2. Features

#### Real AI-Powered Responses
- Intelligent, context-aware responses using Google Gemini Pro
- Lyvo+ specific system prompt and knowledge base
- Natural conversation flow
- Real-time AI processing

#### Smart Fallback System
- Automatic fallback to predefined responses if Gemini API fails
- Graceful error handling for rate limits and network issues
- Status indicators in the chat interface

#### Status Indicators
- **Green**: Gemini Pro AI service is online and ready
- **Yellow**: Fallback mode (API unavailable or rate limited)
- **Gray**: Initializing connection

### 5. Usage

The chatbot is automatically integrated into the SeekerDashboard. Users can:

1. Click the floating chat button
2. Ask questions about:
   - Room pricing and availability
   - Property locations
   - Amenities and facilities
   - Booking process
   - Roommate matching
   - Security features
   - Payment options
   - Support contact information

### 6. Customization

#### System Prompt
The AI is configured with a comprehensive system prompt in `aiService.js` that includes:
- Lyvo+ brand information
- Service details and pricing
- Location information
- Amenities and features
- Booking process
- Support contact details

#### Response Categories
The fallback system includes predefined responses for common topics:
- Greeting messages
- Pricing information
- Location details
- Amenities list
- Booking process
- Roommate matching
- Security features
- Payment methods
- Support contact

### 7. Error Handling

The system includes multiple layers of error handling:

1. **Service Initialization**: Checks if AI service can be initialized
2. **API Calls**: Handles failures in AI model requests
3. **Fallback Responses**: Provides predefined responses when AI fails
4. **User Feedback**: Shows appropriate status messages to users

### 8. Development

#### Testing
To test the AI integration:

1. Ensure your GitHub token is valid
2. Check the browser console for any initialization errors
3. Try asking various questions to test both AI and fallback responses

#### Debugging
- Check browser console for error messages
- Verify environment variables are loaded correctly
- Test with different types of questions

### 9. Security Considerations

- GitHub tokens should be kept secure
- Never commit tokens to version control
- Use environment variables for all sensitive configuration
- Consider implementing rate limiting for production use

### 10. Future Enhancements

Potential improvements for the AI chatbot:

- Conversation memory across sessions
- Integration with user profile data
- Multi-language support
- Voice input/output
- Integration with booking system
- Real-time property availability updates

## Troubleshooting

### Common Issues

1. **"AI service unavailable" message**
   - Check browser console for detailed error messages
   - Verify the service is properly initialized
   - Restart the application if needed

2. **Slow responses**
   - Normal for enhanced AI processing (simulated delay)
   - Responses typically take 0.5-1.5 seconds
   - This simulates real AI processing for better UX

3. **Generic responses**
   - Check if keywords are being matched correctly
   - Try rephrasing your question
   - Use more specific terms related to co-living

### Testing

Use the AITest component to verify the chatbot is working:

```jsx
import AITest from './components/AITest';

// Add to any page for testing
<AITest />
```

### Support

For technical support with the AI integration:
- Check the browser console for detailed error messages
- Use the AITest component to verify functionality
- Contact the development team for advanced troubleshooting
