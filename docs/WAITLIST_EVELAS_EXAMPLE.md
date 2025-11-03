# Waitlist API - evelas.co Integration Example

## Quick Test

Use this simple HTML form to test the waitlist API from evelas.co:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CENIE Waitlist - evelas.co</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    button {
      padding: 12px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #0051cc;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .message {
      padding: 15px;
      border-radius: 4px;
      margin-top: 15px;
    }
    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  </style>
</head>
<body>
  <h1>Join CENIE Waitlist</h1>
  <p>Get notified when CENIE platform launches!</p>

  <form id="waitlist-form">
    <input 
      type="text" 
      id="name" 
      name="name"
      placeholder="Full Name" 
      required 
      minlength="2"
    />
    <input 
      type="email" 
      id="email" 
      name="email"
      placeholder="Email Address" 
      required 
    />
    <button type="submit" id="submit-btn">
      Join Waitlist
    </button>
  </form>

  <div id="message"></div>

  <script>
    const API_URL = 'https://cenie.org/api/waitlist'
    // For testing locally: const API_URL = 'http://localhost:3000/api/waitlist'

    const form = document.getElementById('waitlist-form')
    const messageDiv = document.getElementById('message')
    const submitBtn = document.getElementById('submit-btn')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const name = document.getElementById('name').value
      const email = document.getElementById('email').value
      
      // Clear previous message
      messageDiv.innerHTML = ''
      messageDiv.className = ''
      
      // Disable button
      submitBtn.disabled = true
      submitBtn.textContent = 'Subscribing...'
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: name,
            email: email,
            source: 'evelas'
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          // Success
          messageDiv.textContent = data.message || 'Successfully subscribed!'
          messageDiv.className = 'message success'
          form.reset()
        } else {
          // Error from API
          messageDiv.textContent = data.message || data.error || 'Subscription failed'
          messageDiv.className = 'message error'
          
          // Log debug info if available
          if (data.debug) {
            console.error('Debug info:', data.debug)
          }
        }
      } catch (error) {
        // Network or other error
        console.error('Request failed:', error)
        messageDiv.textContent = 'Network error. Please check your connection and try again.'
        messageDiv.className = 'message error'
      } finally {
        // Re-enable button
        submitBtn.disabled = false
        submitBtn.textContent = 'Join Waitlist'
      }
    })
  </script>
</body>
</html>
```

## Next.js/React Component Example

```tsx
'use client'

import { useState } from 'react'

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('https://cenie.org/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          source: 'evelas',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Successfully subscribed!')
        setFormData({ full_name: '', email: '' })
      } else {
        setStatus('error')
        setMessage(data.message || data.error || 'Subscription failed')
        
        // Log debug info if available
        if (data.debug) {
          console.error('Debug info:', data.debug)
        }
      }
    } catch (error) {
      console.error('Request failed:', error)
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        required
        minLength={2}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Join Waitlist'}
      </button>
      
      {message && (
        <p className={status === 'error' ? 'error' : 'success'}>
          {message}
        </p>
      )}
    </form>
  )
}
```

## Security Settings (Relaxed for External Apps)

✅ **CORS:** Enabled for `evelas.co` and all subdomains  
✅ **Rate Limiting:** 50 requests per hour per IP (relaxed from 5)  
✅ **Authentication:** NOT required (public endpoint)  
✅ **Validation:** Email format + name length only  

## Debugging

If you encounter issues:

1. **Check browser console** for CORS errors
2. **Check Network tab** to see the actual request/response
3. **Look for debug field** in error responses (development mode only)
4. **Test with curl** to isolate frontend issues:

```bash
curl -X POST https://cenie.org/api/waitlist \
  -H "Content-Type: application/json" \
  -H "Origin: https://evelas.co" \
  -d '{
    "full_name": "Test User",
    "email": "test@evelas.co",
    "source": "evelas"
  }'
```

## Expected Responses

### Success (201)
```json
{
  "success": true,
  "message": "Successfully subscribed to waitlist",
  "subscriber": {
    "id": "uuid-here",
    "full_name": "Test User",
    "email": "test@evelas.co",
    "source": "evelas",
    "subscribed_at": "2025-02-01T10:30:00.000Z"
  }
}
```

### Already Subscribed (409)
```json
{
  "error": "Already subscribed",
  "message": "This email is already on the waitlist",
  "subscribed_at": "2025-02-01T10:30:00.000Z"
}
```

### Validation Error (400)
```json
{
  "error": "Validation error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Rate Limit (429)
```json
{
  "error": "Too many subscription attempts",
  "message": "Please try again later",
  "resetInSeconds": 2847
}
```

## Deployment Checklist

- ✅ Deploy hub app to production
- ✅ Run migration in Supabase
- ✅ Verify CORS works from evelas.co
- ✅ Test form submission
- ✅ Check Supabase logs for entries
- ✅ Monitor server logs for errors

---

**Status:** ✅ Ready for Production  
**Last Updated:** February 2025  
**Security Level:** Relaxed (public access with rate limiting)

