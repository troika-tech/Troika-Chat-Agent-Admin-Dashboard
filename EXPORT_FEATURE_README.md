# Leads Export Feature

## Overview
The Leads Export feature allows users to download lead data as CSV files with comprehensive filtering options and detailed lead information.

## API Endpoint

### GET /api/hybrid-leads/export

**Query Parameters:**
- `companyId` - Filter by company ID
- `chatbotId` - Filter by chatbot ID  
- `confidence` - Filter by confidence level (high, medium, low)
- `category` - Filter by lead category (buying_intent, pricing_inquiry, demo_request)
- `language` - Filter by language (en, es, fr, hi_transliterated)
- `startDate` - Filter from date (ISO format: 2024-01-01T00:00:00Z)
- `endDate` - Filter to date (ISO format: 2024-01-31T23:59:59Z)

**Response:**
- **Success**: CSV file download
- **Error**: JSON response with error details

```json
{
  "success": false,
  "message": "Failed to export leads CSV",
  "error": "Error details"
}
```

## CSV Export Columns

The exported CSV includes the following columns:

### Basic Lead Information
- **Lead ID** - Unique lead identifier
- **Chatbot Name** - Name of the chatbot that generated the lead
- **Company Name** - Company associated with the lead
- **Session ID** - Session identifier

### Contact Information
- **Email** - Lead email address
- **Phone** - Lead phone number

### Lead Scoring & Analysis
- **Lead Score** - Numeric score (0-100)
- **Interest Level** - hot, high, medium, low
- **Confidence** - high, medium, low
- **Category** - buying_intent, pricing_inquiry, demo_request, general_inquiry

### Language & Detection
- **Primary Language** - Primary detected language code
- **Detected Languages** - All detected languages (semicolon-separated)

### AI Analysis
- **AI Legitimate** - Yes/No if AI verified as legitimate
- **AI Confidence Score** - AI confidence score (0-100)
- **AI Verification Reasons** - Reasons for AI analysis (semicolon-separated)

### Status & Timestamps
- **Status** - new, contacted, qualified, converted, lost
- **Created At** - Lead creation timestamp
- **Updated At** - Last update timestamp

### Technical Information
- **User Agent** - Browser user agent string
- **IP Address** - Lead's IP address
- **Location Country** - Detected country
- **Location City** - Detected city

### Engagement Metrics
- **Message Count** - Number of messages in session
- **Session Duration** - Session duration in seconds
- **First Interest Detected** - When interest was first detected
- **Last Interest Detected** - When interest was last detected
- **Conversation Summary** - AI-generated conversation summary
- **Tags** - Lead tags (comma-separated)

### Conversion Data
- **Notes Count** - Number of notes added
- **Converted At** - Conversion timestamp (if converted)
- **Conversion Value** - Conversion value (if converted)
- **Conversion Source** - Source of conversion

## Implementation Features

### 🎯 **Export Button**
- **Location**: Header section next to other action buttons
- **Color**: Green button with download icon
- **States**: Normal, loading (with animation), disabled
- **Text**: "Export CSV" / "Exporting..."

### 🔧 **Filtering Integration**
- **Confidence Filter**: Exports only leads matching selected confidence level
- **Time Period**: Exports leads from selected time period (7, 30, 90 days)
- **Search Term**: Exports leads matching search criteria
- **Company ID**: Automatically includes company ID in export

### 📊 **Mock Data Support**
- **Mock CSV Generation**: Creates realistic CSV with all columns
- **Sample Data**: Uses current filtered leads for mock export
- **Realistic Values**: Includes realistic technical and engagement data
- **File Naming**: `mock-leads-export-YYYY-MM-DD.csv`

### 🚀 **Real API Integration**
- **Parameter Building**: Automatically builds query parameters
- **Date Range**: Calculates start/end dates based on selected period
- **Error Handling**: Comprehensive error handling with user feedback
- **File Download**: Automatic CSV file download with proper naming

## Usage Examples

### Basic Export
```javascript
// Export all leads for company
const exportParams = {
  companyId: "123"
};
await leadsService.exportLeads(exportParams);
```

### Filtered Export
```javascript
// Export high-confidence leads from last 30 days
const exportParams = {
  companyId: "123",
  confidence: "high",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-01-31T23:59:59Z"
};
await leadsService.exportLeads(exportParams);
```

### Category-Specific Export
```javascript
// Export demo requests only
const exportParams = {
  companyId: "123",
  category: "demo_request"
};
await leadsService.exportLeads(exportParams);
```

## File Naming Convention

- **Real Export**: `leads-export-YYYY-MM-DD.csv`
- **Mock Export**: `mock-leads-export-YYYY-MM-DD.csv`
- **Date Format**: ISO date format (YYYY-MM-DD)

## Error Handling

### Common Error Scenarios
1. **No Company ID**: Shows error message
2. **API Failure**: Shows error toast with details
3. **Network Issues**: Graceful error handling
4. **Invalid Parameters**: Parameter validation

### User Feedback
- **Success**: Green toast notification
- **Error**: Red toast notification with details
- **Loading**: Button shows "Exporting..." with animation
- **Mock Mode**: Special handling for mock data

## Technical Implementation

### API Service (`src/services/api.js`)
```javascript
export const exportLeads = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/hybrid-leads/export?${queryParams.toString()}`, {
    responseType: 'blob', // Important for file downloads
  });
};
```

### Leads Service (`src/services/leadsService.js`)
```javascript
exportLeads: async (params = {}) => {
  try {
    const response = await exportLeads(params);
    return response;
  } catch (error) {
    console.error("Error exporting leads:", error);
    throw error;
  }
}
```

### Mock CSV Generation (`src/services/mockLeadsData.js`)
```javascript
export const generateMockCSV = (leads = mockLeads) => {
  const headers = [/* all column headers */];
  const csvRows = [headers.join(',')];
  
  leads.forEach(lead => {
    const row = [/* lead data mapped to columns */];
    csvRows.push(escapedRow.join(','));
  });
  
  return csvRows.join('\n');
};
```

## Testing

### Mock Data Testing
1. **Toggle Mock Mode**: Use "Mock Data ON" button
2. **Apply Filters**: Set confidence, search terms, time period
3. **Export**: Click "Export CSV" button
4. **Verify**: Check downloaded CSV file

### Real API Testing
1. **Toggle Live Mode**: Use "Mock Data OFF" button
2. **Configure API**: Ensure API endpoint is accessible
3. **Export**: Click "Export CSV" button
4. **Verify**: Check API response and file download

## Security Considerations

- **Authentication**: Uses existing token-based authentication
- **Company Isolation**: Only exports leads for authenticated company
- **Parameter Validation**: Validates all input parameters
- **Error Sanitization**: Prevents sensitive data in error messages

## Performance

- **Blob Handling**: Efficient file download using Blob API
- **Memory Management**: Proper cleanup of object URLs
- **Loading States**: User feedback during export process
- **Error Recovery**: Graceful handling of export failures

## Future Enhancements

- **Export Formats**: Support for Excel, JSON formats
- **Scheduled Exports**: Automated export scheduling
- **Export History**: Track export history and downloads
- **Custom Columns**: User-selectable export columns
- **Bulk Operations**: Export multiple companies at once
- **Email Delivery**: Send exports via email
- **Compression**: ZIP file support for large exports
