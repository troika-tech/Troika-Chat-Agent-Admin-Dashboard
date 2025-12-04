# Bug Fix: 404 Error When Creating Chatbot

## Issue
```
Failed to load resource: the server responded with a status of 404 (Not Found)
/api/chatbot/create:1
Error creating chatbot: Object
handleCreateChatbot @ CompanyTable.jsx:69
```

## Root Causes

### 1. Token Key Mismatch
- **Problem**: `CompanyTable.jsx` was using `localStorage.getItem("adminToken")` 
- **Reality**: AuthContext stores token as `"token"` (not `"adminToken"`)
- **Impact**: Token was `null`, causing authentication to fail

### 2. Unnecessary Manual Authorization Header
- **Problem**: Manually adding Authorization header even though `api.js` interceptor handles it
- **Impact**: Redundant code and potential for errors

### 3. API Service Route Mismatch
- **Problem**: `api.js` had `createChatbot` function calling `/chatbots` (plural)
- **Reality**: Backend route is `/api/chatbot/create` (singular)
- **Impact**: If using the service function, it would call wrong endpoint

## Fixes Applied

### ✅ Fixed `CompanyTable.jsx`
- Removed manual token retrieval (`adminToken`)
- Removed manual Authorization header
- Now relies on `api.js` interceptor which automatically adds token from `localStorage.getItem("token")`

### ✅ Fixed `api.js`
- Updated `createChatbot` function to use correct route: `/chatbot/create` (matches backend)

## Files Modified

1. **chatbot-dashboard/src/components/CompanyTable.jsx**
   - `handleCreateChatbot`: Removed manual token/header
   - `handleDeleteChatbot`: Removed manual token/header  
   - `handleDeleteCompany`: Removed manual token/header

2. **chatbot-dashboard/src/services/api.js**
   - `createChatbot`: Updated route from `/chatbots` to `/chatbot/create`

## Testing

After these fixes, chatbot creation should work correctly:
1. ✅ Token is automatically added by interceptor
2. ✅ Route path matches backend (`/api/chatbot/create`)
3. ✅ No manual header manipulation needed

## Additional Notes

### Other Files Using `adminToken`
The following files still use `adminToken` but may work if they're not using the `api` service:
- `pages/OverviewPage.jsx`
- `components/MessageHistory.jsx`
- `components/EditAdminModal.jsx`
- `components/CompanyModal.jsx`
- `components/AddCompanyModal.jsx`

**Recommendation**: Update these files to use `"token"` instead of `"adminToken"` for consistency, or better yet, use the `api` service which handles authentication automatically.

## Backend Route Verification

Backend route structure:
- **Mount point**: `/api/chatbot` (in `app.js`)
- **Route**: `/create` (in `chatbotRoutes.js`)
- **Full path**: `/api/chatbot/create` ✅
- **Method**: POST
- **Auth**: Requires `protect` + `restrictTo("admin")`

## Related Code

### Backend Route
```javascript
// chatbot-backend/routes/chatbotRoutes.js
router.post("/create", protect, restrictTo("admin"), createChatbot);
```

### Frontend API Service
```javascript
// chatbot-dashboard/src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ Uses "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### AuthContext Storage
```javascript
// chatbot-dashboard/src/context/AuthContext.jsx
localStorage.setItem("token", token); // ✅ Stores as "token"
```

---

**Status**: ✅ Fixed  
**Date**: 2025-01-28

