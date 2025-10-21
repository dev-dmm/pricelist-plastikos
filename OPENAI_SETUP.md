# OpenAI Email Generation Setup

## Overview
The email system now uses OpenAI's ChatGPT to generate personalized, humanized email content for pricing estimates. Each email is dynamically generated based on the patient's specific information and requirements.

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the API key

### 2. Configure Environment Variables
Add these variables to your `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_ORGANIZATION=your-openai-organization-id-here
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. How It Works

1. **When an email is sent**: The system calls OpenAI's API with the patient's information
2. **AI generates content**: ChatGPT creates a personalized, humanized email in Greek
3. **Fallback system**: If OpenAI fails, the system uses a pre-written template
4. **Dynamic content**: Each email is unique and tailored to the specific patient

### 4. Features

- **Personalized greetings** using the patient's name
- **Contextual content** based on the specific procedure
- **Humanized tone** that sounds like a real doctor wrote it
- **Greek language** with natural, conversational style
- **Pricing details** integrated naturally into the text
- **Fallback protection** if OpenAI is unavailable

### 5. Cost Considerations

- Uses GPT-3.5-turbo (cheaper than GPT-4)
- Limited to 1000 tokens per email
- Estimated cost: ~$0.001-0.002 per email
- Fallback system prevents failed emails

### 6. Customization

You can modify the AI prompt in `app/Services/OpenAIService.php` to:
- Change the tone (more formal/casual)
- Add specific instructions
- Modify the personality of the "doctor"
- Adjust the content structure

### 7. Testing

To test the OpenAI integration:
1. Ensure your API key is set correctly
2. Submit a test form on your website
3. Check the generated email content
4. Verify the fallback works by temporarily using an invalid API key

### 8. Monitoring

- Check Laravel logs for OpenAI API errors
- Monitor API usage in your OpenAI dashboard
- Set up alerts for API failures if needed

## Troubleshooting

**If emails are not being generated:**
1. Check your API key is valid
2. Verify you have OpenAI credits
3. Check Laravel logs for error messages
4. Ensure the fallback system is working

**If content quality is poor:**
1. Modify the system prompt in `OpenAIService.php`
2. Adjust the temperature setting (0.7 is good for creativity)
3. Increase max_tokens if content is cut off
