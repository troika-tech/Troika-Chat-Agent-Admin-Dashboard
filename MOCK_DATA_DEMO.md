# Mock Data Demo for Leads Dashboard

## Overview
The Leads Dashboard now includes comprehensive mock data for testing and development purposes. This allows you to test all features without needing a live API connection.

## Mock Data Features

### 🎯 **Realistic Lead Data**
- **10 Sample Leads** with diverse characteristics
- **Multiple Companies** (TechCorp, Global Enterprises, StartupXYZ, etc.)
- **Various Lead Scores** (41-95 range)
- **Different Interest Levels** (hot, high, medium, low)
- **Confidence Levels** (high, medium, low)
- **Multiple Categories** (buying_intent, pricing_inquiry, demo_request, general_inquiry)
- **International Support** (English, Spanish, French, German)
- **AI Analysis Results** with legitimacy scores and reasons

### 📊 **Analytics Data**
- **Total Leads**: 247 (30 days)
- **Confidence Breakdown**: 89 high, 123 medium, 35 low
- **Category Analysis**: Buying intent (95), Pricing inquiry (67), Demo requests (45), General inquiry (40)
- **Language Support**: English (180), Spanish (35), French (20), German (12)
- **AI Analysis**: 200 total, 178 legitimate, 82.5% avg confidence

### 📈 **Performance Metrics**
- **Real-time Detections**: 189
- **Batch Detections**: 58
- **AI Calls**: 67
- **Error Rate**: 1.5%
- **Uptime**: 30 days
- **Language Detections**: 247

### 🏥 **System Health**
- **Health Score**: 92%
- **Status**: Healthy
- **All Components**: Active (Real-time Detection, Batch Processing, AI Analysis, Language Detection)

## How to Use Mock Data

### 1. **Toggle Mock Data Mode**
- Click the "Mock Data ON/OFF" button in the header
- Green button = Mock data active
- Gray button = Live API mode

### 2. **Visual Indicators**
- **Header Badge**: Shows "Testing with mock data" when active
- **Floating Indicator**: Top-right corner shows current mode
- **Toast Notifications**: Confirms when mock data is loaded

### 3. **Testing Features**
- **Search**: Filter leads by email, company, or phone
- **Status Filter**: Filter by new, contacted, qualified, converted, lost
- **Confidence Filter**: Filter by high, medium, low confidence
- **Time Periods**: Test with 7, 30, or 90-day periods
- **Batch Processing**: Simulated batch processing with delay

## Sample Lead Data

### High-Value Lead Example
```json
{
  "id": "lead_001",
  "company": "TechCorp Solutions",
  "email": "john.doe@techcorp.com",
  "leadScore": 87,
  "interestLevel": "hot",
  "confidence": "high",
  "category": "buying_intent",
  "status": "new",
  "aiAnalysis": {
    "isLegitimate": true,
    "confidenceScore": 89.5,
    "reasons": ["Valid email domain", "Professional communication", "Clear intent signals"]
  }
}
```

### International Lead Example
```json
{
  "id": "lead_006",
  "company": "FinanceFirst",
  "email": "anna.muller@financefirst.de",
  "phone": "+49-30-12345678",
  "leadScore": 78,
  "interestLevel": "high",
  "confidence": "high",
  "category": "buying_intent",
  "detectedLanguages": ["de", "en"],
  "primaryLanguage": "de"
}
```

## Testing Scenarios

### 1. **Search Functionality**
- Search for "techcorp" → Shows TechCorp leads
- Search for "john" → Shows John Doe's lead
- Search for "+1-555" → Shows US phone numbers

### 2. **Filter Combinations**
- Status: "new" + Confidence: "high" → Shows high-confidence new leads
- Status: "qualified" → Shows qualified leads only
- Confidence: "low" → Shows low-confidence leads

### 3. **Time Period Testing**
- 7 days → Same data, different period label
- 30 days → Default mock data
- 90 days → Same data, different period label

### 4. **Batch Processing**
- Click "Process Batches" → Simulates 1.5s delay
- Shows success message
- Refreshes data (same mock data)

## Mock Data Structure

### Lead Object
```typescript
interface Lead {
  id: string;
  chatbot: string;
  company: string;
  sessionId: string;
  email: string | null;
  phone: string | null;
  leadScore: number; // 0-100
  interestLevel: 'hot' | 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
  category: 'buying_intent' | 'pricing_inquiry' | 'demo_request' | 'general_inquiry';
  patterns: string[];
  detectedLanguages: string[];
  primaryLanguage: string;
  aiAnalysis: {
    isLegitimate: boolean;
    confidenceScore: number;
    reasons: string[];
  };
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

## Development Benefits

### ✅ **No API Dependencies**
- Test without backend setup
- Consistent data for development
- No rate limiting or authentication issues

### ✅ **Realistic Testing**
- Diverse lead characteristics
- International data support
- Various confidence and interest levels
- Realistic AI analysis results

### ✅ **Feature Validation**
- All UI components work with mock data
- Filtering and search functionality
- Pagination and sorting
- Error handling and loading states

### ✅ **Easy Switching**
- Toggle between mock and live data
- Visual indicators for current mode
- Fallback to mock data on API errors

## Customization

To modify mock data, edit `src/services/mockLeadsData.js`:

1. **Add More Leads**: Extend the `mockLeads` array
2. **Modify Analytics**: Update `mockAnalytics` object
3. **Change Metrics**: Adjust `mockMetrics` values
4. **Update Health**: Modify `mockHealth` status
5. **Adjust Delays**: Change `mockApiDelay` timing

## Production Deployment

When deploying to production:
1. Set `useMockData` to `false` by default
2. Remove or hide the mock data toggle
3. Ensure proper API endpoints are configured
4. Test with real data before going live

The mock data system provides a robust testing environment while maintaining the ability to switch to live data when needed.
