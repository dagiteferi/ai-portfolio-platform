# Google Gemini API Setup Guide

## Current Configuration

This project uses **Google Gemini 2.5 Flash** as the LLM for the AI chatbot.

### Model Details

- **Model**: `gemini-2.5-flash`
- **Provider**: Google AI (Generative AI)
- **Temperature**: 0.6 (configurable)
- **Use Case**: Fast, efficient responses for portfolio chatbot

---

## Getting Your API Key

### Step 1: Access Google AI Studio

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create an API Key

1. Click **"Create API Key"**
2. Select or create a Google Cloud project
3. Copy the generated API key (starts with `AIza...`)
4. **Important**: Store it securely - you won't see it again!

### Step 3: Configure Your Environment

Add the API key to your `.env` file:

```bash
# Google Gemini API Configuration
GOOGLE_API_KEY=AIzaSy...your-actual-key-here

# Optional: Override default model
LLM_MODEL_NAME=gemini-2.5-flash

# Optional: Adjust temperature (0.0 - 1.0)
LLM_TEMPERATURE=0.6
```

---

## Rate Limits & Quotas

### Free Tier Limits

Google Gemini has different rate limits based on your tier:

| Tier | Requests/Min (RPM) | Requests/Day (RPD) | Tokens/Min (TPM) |
|------|-------------------|-------------------|------------------|
| **Free** | 15 | 1,500 | 1M |
| **Tier 1** | 2,000 | 50,000 | 4M |

**Note**: Your app makes **2 API calls per user message**:
1. Role analysis
2. Response generation

### Upgrading Your Tier

To get higher limits:

1. Visit [Google AI Studio Usage](https://aistudio.google.com/usage)
2. Check your current tier
3. Follow upgrade instructions if needed (requires Google Cloud billing)

---

## Available Gemini Models

You can change the model by updating `LLM_MODEL_NAME` in your `.env`:

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `gemini-2.5-flash` | ⚡ Very Fast | ⭐⭐⭐ Good | **Current** - Best for chatbots |
| `gemini-2.0-flash` | ⚡ Fast | ⭐⭐⭐ Good | Previous generation |
| `gemini-1.5-pro` | 🐌 Slower | ⭐⭐⭐⭐⭐ Excellent | Complex reasoning |
| `gemini-1.5-flash` | ⚡ Fast | ⭐⭐⭐ Good | Older flash model |

**Recommendation**: Stick with `gemini-2.5-flash` for the best balance of speed and quality.

---

## Troubleshooting

### Error: "GOOGLE_API_KEY not found"

**Solution**:
1. Make sure you have a `.env` file in the project root
2. Add `GOOGLE_API_KEY=your-key-here`
3. Restart your server

### Error: "429 - Quota exceeded"

**Causes**:
- You've hit your daily request limit (1,500 for free tier)
- You've hit your per-minute limit (15 RPM for free tier)

**Solutions**:
1. **Wait**: Quotas reset at midnight Pacific Time
2. **Upgrade**: Enable billing and upgrade to Tier 1
3. **Optimize**: Reduce the number of API calls in your code

### Error: "Invalid API key"

**Solutions**:
1. Verify the API key is correct (no extra spaces)
2. Check if the key is still active in [AI Studio](https://aistudio.google.com/app/apikey)
3. Create a new API key if needed

### Error: "API key not valid for this model"

**Solution**:
- Some models require specific permissions
- Try switching to `gemini-2.5-flash` or `gemini-1.5-flash`

---

## Monitoring Usage

Track your API usage:

1. Visit [Google AI Studio Usage Dashboard](https://aistudio.google.com/usage)
2. View:
   - Total requests
   - Tokens used
   - Rate limit status
   - Current tier

---

## Cost Information

### Free Tier

- ✅ **1,500 requests/day** - Free
- ✅ **1M tokens/minute** - Free
- ✅ Perfect for development and testing

### Paid Tier (Tier 1+)

If you enable Google Cloud billing:

- **Gemini 2.5 Flash**: Very affordable
- **Pay-as-you-go**: Only pay for what you use
- **Higher limits**: 2,000 RPM, 50,000 RPD

**Estimated cost for a portfolio chatbot**: < $5/month with moderate usage

---

## Best Practices

1. **Use Environment Variables**: Never hardcode API keys
2. **Monitor Usage**: Check your dashboard regularly
3. **Implement Caching**: Cache common responses to reduce API calls
4. **Error Handling**: The app already has retry logic built-in
5. **Rate Limiting**: Consider adding user-side rate limiting for production

---

## Support & Resources

- **Google AI Studio**: https://aistudio.google.com
- **API Documentation**: https://ai.google.dev/gemini-api/docs
- **Rate Limits Info**: https://ai.google.dev/gemini-api/docs/rate-limits
- **Pricing**: https://ai.google.dev/pricing

---

## Quick Reference

```bash
# .env Configuration
GOOGLE_API_KEY=AIzaSy...your-key-here
LLM_MODEL_NAME=gemini-2.5-flash
LLM_TEMPERATURE=0.6

# Start the server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Check if it's working
curl http://localhost:8000/api/health
```

---

**Last Updated**: January 2026  
**Current Model**: Gemini 2.5 Flash  
**Maintained by**: Dagmawi Teferi
