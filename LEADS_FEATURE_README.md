# Leads Dashboard Feature

## Overview
The Leads Dashboard is a comprehensive feature that provides real-time analytics, metrics, and management capabilities for lead generation and analysis. It integrates with the hybrid leads API to provide insights into lead quality, performance metrics, and system health.

## Features

### 📊 Analytics Dashboard
- **Total Leads**: Real-time count of leads generated
- **Confidence Breakdown**: Categorization by high, medium, and low confidence levels
- **Category Analysis**: Breakdown by lead categories (buying_intent, pricing_inquiry, demo_request, general_inquiry)
- **Language Detection**: Multi-language support with language breakdown
- **AI Analysis**: AI-powered lead verification and legitimacy scoring

### 📈 Performance Metrics
- **Real-time Detections**: Live lead detection count
- **Batch Processing**: Batch detection statistics
- **AI Calls**: Number of AI analysis calls made
- **Error Rate**: System error tracking
- **Uptime**: System availability monitoring
- **Language Detections**: Multi-language processing statistics

### 🏥 System Health Monitoring
- **Health Score**: Overall system health percentage
- **Component Status**: Real-time status of all system components
- **Uptime Tracking**: System availability monitoring
- **Error Rate Monitoring**: Real-time error tracking

### 📋 Lead Management
- **Lead Table**: Comprehensive lead listing with filtering and search
- **Lead Scoring**: Visual lead score indicators (0-100)
- **Status Tracking**: Lead status management (new, contacted, qualified, converted, lost)
- **Interest Levels**: Lead interest categorization (hot, high, medium, low)
- **Confidence Levels**: AI confidence scoring (high, medium, low)
- **Category Classification**: Automatic lead categorization
- **Contact Information**: Email and phone number display
- **Timestamps**: Creation and update time tracking

## API Endpoints

### Analytics
```
GET /api/hybrid-leads/analytics?companyId=123&days=30
```
Returns comprehensive analytics data including lead counts, confidence breakdown, category analysis, and AI analysis results.

### Metrics
```
GET /api/hybrid-leads/metrics
```
Returns performance metrics including detection counts, error rates, and system status.

### Health
```
GET /api/hybrid-leads/health
```
Returns system health status, uptime, and component status.

### Batch Processing
```
POST /api/hybrid-leads/process-batches
```
Processes all pending lead batches.

### Lead Data
```
GET /api/hybrid-leads?page=1&limit=10&search=term&status=new&confidence=high
```
Returns paginated lead data with filtering options.

## Lead Data Structure

```json
{
  "id": "string",                    // Lead ID
  "chatbot": "string",               // Chatbot name
  "company": "string",               // Company name
  "sessionId": "string",             // Session identifier
  "email": "string",                 // Lead email (nullable)
  "phone": "string",                 // Lead phone (nullable)
  "leadScore": "number",             // 0-100 lead score
  "interestLevel": "string",         // hot, high, medium, low
  "confidence": "string",            // high, medium, low
  "category": "string",              // buying_intent, pricing_inquiry, etc.
  "patterns": ["string"],            // Detected patterns
  "detectedLanguages": ["string"],   // Array of detected languages
  "primaryLanguage": "string",       // Primary language code
  "aiAnalysis": {
    "isLegitimate": "boolean",       // AI verification result
    "confidenceScore": "number",     // AI confidence score
    "reasons": ["string"]            // AI analysis reasons
  },
  "status": "string",                // new, contacted, qualified, converted, lost
  "createdAt": "string",             // ISO timestamp
  "updatedAt": "string"              // ISO timestamp
}
```

## Components

### LeadsPage.jsx
Main component containing the entire leads dashboard with:
- Analytics cards and charts
- Performance metrics display
- System health monitoring
- Lead management table
- Filtering and search functionality
- Pagination controls

### leadsService.js
Service layer for API communication with:
- Centralized API calls
- Error handling
- Data transformation
- Batch operations

## Navigation
The leads page is accessible through the user sidebar navigation:
- **Path**: `/user/leads`
- **Icon**: Users icon
- **Position**: Between Message History and Enquiries

## Filtering and Search
- **Search**: Text search across lead data
- **Status Filter**: Filter by lead status (new, contacted, qualified, converted, lost)
- **Confidence Filter**: Filter by confidence level (high, medium, low)
- **Time Period**: Filter analytics by time period (7, 30, 90 days)

## Real-time Updates
- Automatic data refresh when filters change
- Real-time system health monitoring
- Live performance metrics
- Batch processing status updates

## Error Handling
- Comprehensive error handling for all API calls
- User-friendly error messages
- Graceful fallbacks for missing data
- Loading states and skeleton loaders

## Responsive Design
- Mobile-friendly responsive layout
- Adaptive grid system
- Touch-friendly interface elements
- Optimized for various screen sizes

## Security
- Protected route requiring user authentication
- Token-based API authentication
- Secure data handling
- Input validation and sanitization

## Performance
- Optimized API calls with parallel requests
- Efficient data loading and caching
- Skeleton loaders for better UX
- Debounced search functionality
- Pagination for large datasets

## Future Enhancements
- Export functionality for lead data
- Advanced filtering options
- Lead assignment and workflow management
- Integration with CRM systems
- Real-time notifications
- Advanced analytics and reporting
- Lead scoring customization
- Automated lead qualification
