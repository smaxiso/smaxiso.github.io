# Backend Keep-Alive Cron Job

This document provides cron job configurations to keep the Render backend instance awake.

## 🎯 Why You Need This

Render's free tier spins down after 15 minutes of inactivity. This cron job pings the backend every 14 minutes to keep it alive.

## ✅ Available Health Check Endpoints

After deployment, these endpoints are available:

1. **`/health`** - Dedicated health check
   ```bash
   curl https://smaxiso-portfolio-backend.onrender.com/health
   ```
   Response:
   ```json
   {
     "status": "healthy",
     "message": "Backend is awake and running",
     "service": "Portfolio API"
   }
   ```

2. **`/ping`** - Alias for `/health`
   ```bash
   curl https://smaxiso-portfolio-backend.onrender.com/ping
   ```

3. **`/`** - Root endpoint
   ```bash
   curl https://smaxiso-portfolio-backend.onrender.com/
   ```
   Response:
   ```json
   {"message": "Portfolio API is running!"}
   ```

## 🔧 Cron Job Configuration

### Option 1: UptimeRobot (Recommended)

**Free service** that monitors your website and keeps it alive.

1. Sign up at [https://uptimerobot.com](https://uptimerobot.com)
2. Create a new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://smaxiso-portfolio-backend.onrender.com/health`
   - **Monitoring Interval**: 5 minutes (or lower if available)
   - **Alert Contacts**: Your email

**Benefits**: 
- Free, reliable, no setup
- Email alerts if backend goes down
- Dashboard to view uptime stats

### Option 2: Cron-job.org

1. Sign up at [https://cron-job.org](https://cron-job.org)
2. Create a new cron job:
   - **URL**: `https://smaxiso-portfolio-backend.onrender.com/health`
   - **Schedule**: Every 14 minutes
   - **Request method**: GET

### Option 3: GitHub Actions (Free)

Create `.github/workflows/keep-backend-alive.yml`:

```yaml
name: Keep Backend Alive

on:
  schedule:
    # Runs every 14 minutes
    - cron: '*/14 * * * *'
  workflow_dispatch:  # Allows manual trigger

jobs:
  ping-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://smaxiso-portfolio-backend.onrender.com/health)
          if [ $response -eq 200 ]; then
            echo "✅ Backend is alive (HTTP $response)"
          else
            echo "❌ Backend returned HTTP $response"
            exit 1
          fi
```

**Benefits**:
- Free (GitHub Actions has 2000 minutes/month free)
- Runs automatically
- No external service needed

### Option 4: Local Cron Job (Linux/Mac)

Edit your crontab:
```bash
crontab -e
```

Add this line:
```cron
*/14 * * * * curl -s https://smaxiso-portfolio-backend.onrender.com/health > /dev/null 2>&1
```

**Note**: Your computer must be running for this to work.

### Option 5: Render.com Cron Job

If you upgrade to a paid plan, Render offers built-in cron jobs that can ping your service.

## 📊 Monitoring

### Check Backend Status

```bash
# Quick check
curl https://smaxiso-portfolio-backend.onrender.com/health

# Check with timing
curl -w "\nTime: %{time_total}s\n" https://smaxiso-portfolio-backend.onrender.com/health
```

### Expected Responses

**Backend is awake:**
```json
{
  "status": "healthy",
  "message": "Backend is awake and running",
  "service": "Portfolio API"
}
```
Response time: < 1 second

**Backend is sleeping (spinning up):**
- Response time: 30-60 seconds
- Eventually returns 200 OK

**Backend is down:**
- Connection timeout or 5xx error

## 🚀 Recommended Setup

**Best practice**: Use **UptimeRobot** or **GitHub Actions**

1. **UptimeRobot**: Set up a 5-minute monitor
2. **GitHub Actions**: Add the workflow file
3. Both are free and reliable

## ⚠️ Important Notes

- **Don't ping too frequently**: Every 14 minutes is optimal
- **Render's free tier limit**: 750 hours/month (31.25 days)
  - With constant uptime, you'll use ~720 hours
  - Leaves 30 hours buffer for mistakes
- **Cold starts**: First request after spin-down takes 30-60 seconds
- **Alternative**: Upgrade to Render's paid plan ($7/month) for always-on instances

## 📝 Testing Your Cron Job

```bash
# Test the endpoint
curl -v https://smaxiso-portfolio-backend.onrender.com/health

# Test with timing
time curl https://smaxiso-portfolio-backend.onrender.com/health
```

Expected output:
```
{"status":"healthy","message":"Backend is awake and running","service":"Portfolio API"}
```

## 🔍 Troubleshooting

### Backend still spins down
- Check cron job is running correctly
- Verify the URL is correct
- Ensure interval is < 15 minutes

### High response times
- Backend might be spinning up
- Wait 30-60 seconds and try again

### Connection errors
- Check if Render service is deployed
- Verify deployment logs on Render dashboard

---

**Deployment Status**: Check at [https://dashboard.render.com](https://dashboard.render.com)
