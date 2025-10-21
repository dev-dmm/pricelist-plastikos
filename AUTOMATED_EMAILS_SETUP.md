# Automated Pricing Estimate Emails Setup

## Overview
This system automatically sends personalized pricing estimate emails to users **1-2 hours** (randomly chosen) after they submit the contact form. The email includes:
- Personalized greeting with their name
- The service they inquired about with detailed pricing breakdown
- Total estimated cost
- Recommended doctor contact information (Phone: 6980935175)
- Professional, branded email template

## How It Works

1. **When a user submits the form**: The system automatically schedules an email to be sent at a random time between 1-2 hours from submission
2. **Every 5 minutes**: The system checks for submissions that have reached their scheduled send time
3. **Email is sent**: A beautifully formatted email with pricing details is sent to the user
4. **Status tracked**: The `email_sent_at` field is updated to prevent duplicate emails

## Setup Instructions

### 1. Configure Email Settings

Edit `.env` file and add your email configuration:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Plastikos"
```

**For Gmail:**
- Enable 2-factor authentication
- Generate an "App Password" (Google Account > Security > App Passwords)
- Use the App Password in `MAIL_PASSWORD`

### 2. Setup Task Scheduling

The emails are scheduled to run daily at 10:00 AM. To enable Laravel's task scheduler:

**On Linux/Mac (crontab):**
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

**On Windows (Task Scheduler):**
1. Open Task Scheduler
2. Create a new task that runs every minute
3. Action: Run `php artisan schedule:run` in your project directory

**For Development/Testing:**
You can run the scheduler manually:
```bash
php artisan schedule:work
```

### 3. Manual Testing

You can manually trigger the email sending command:

```bash
php artisan emails:send-pricing-estimates
```

This will:
- Find all submissions that haven't received emails yet
- Check if they're old enough (based on `email_send_days`)
- Send emails to qualifying submissions
- Mark them as sent

### 4. Test Email Sending

To test the email:

1. Create a test submission in your database (scheduled to send now):
```sql
INSERT INTO submissions (name, email, phone, procedure, category, pricing_details, total_price, created_at, updated_at, email_scheduled_for) 
VALUES (
    'Test User', 
    'your-test-email@gmail.com', 
    '1234567890', 
    'Ρινοπλαστική',
    'Πρόσωπο',
    '[{"name":"Αμοιβή Ιατρού (€)","price_from":2500,"price_to":2500},{"name":"Αναισθησιολόγος (€)","price_from":250,"price_to":250}]',
    '{"min":3530,"max":3530}',
    NOW(),
    NOW(),
    NOW()  -- This schedules the email to be sent immediately
);
```

2. Run the command:
```bash
php artisan emails:send-pricing-estimates
```

3. Check your test email inbox!

**Note**: In production, when users submit the form, the system will automatically set `email_scheduled_for` to a random time between 1-2 hours from now.

## Customization Options

### Change Random Time Range

To change the random time range (currently 1-2 hours):

Edit `app/Models/Submission.php` in the `boot()` method:

```php
protected static function boot()
{
    parent::boot();

    static::creating(function ($submission) {
        if ($submission->email && !$submission->email_scheduled_for) {
            // Change these values to adjust the time range
            $randomMinutes = rand(60, 120); // 60-120 minutes = 1-2 hours
            
            // Examples:
            // 30-60 minutes: rand(30, 60)
            // 2-3 hours: rand(120, 180)
            // 1-4 hours: rand(60, 240)
            
            $submission->email_scheduled_for = now()->addMinutes($randomMinutes);
        }
    });
}
```

### Change Schedule Check Frequency

To change how often the system checks for emails to send (currently every 5 minutes):

Edit `routes/console.php`:

```php
// Current: Every 5 minutes
Schedule::command('emails:send-pricing-estimates')->everyFiveMinutes();

// Alternatives:
Schedule::command('emails:send-pricing-estimates')->everyMinute(); // More responsive
Schedule::command('emails:send-pricing-estimates')->everyTenMinutes();
Schedule::command('emails:send-pricing-estimates')->everyFifteenMinutes();
Schedule::command('emails:send-pricing-estimates')->hourly();
```

### Customize Email Template

Edit `resources/views/emails/pricing-estimate.blade.php` to:
- Change colors and styling
- Modify text and messaging
- Add/remove sections
- Update doctor information

### Change Doctor Phone Number

Edit `app/Mail/PricingEstimateEmail.php`:
```php
public $doctorPhone = '6980935175'; // Change this
```

## Monitoring

### Check Email Status

You can check which submissions have received emails:

```sql
SELECT 
    id, 
    name, 
    email, 
    procedure, 
    created_at, 
    email_sent_at,
    DATEDIFF(email_sent_at, created_at) as days_after_submission
FROM submissions 
WHERE email_sent_at IS NOT NULL
ORDER BY email_sent_at DESC;
```

### View Pending Emails

```sql
SELECT 
    id, 
    name, 
    email, 
    procedure, 
    created_at,
    email_send_days,
    DATEDIFF(NOW(), created_at) as days_since_submission
FROM submissions 
WHERE email_sent_at IS NULL 
AND email IS NOT NULL
ORDER BY created_at DESC;
```

## Troubleshooting

### Emails not sending?

1. **Check email configuration**:
   ```bash
   php artisan tinker
   Mail::raw('Test email', function($msg) { $msg->to('your-email@gmail.com')->subject('Test'); });
   ```

2. **Check scheduler is running**:
   ```bash
   php artisan schedule:list
   ```

3. **Check Laravel logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Run command manually with verbose output**:
   ```bash
   php artisan emails:send-pricing-estimates -v
   ```

### Common Issues

**Gmail blocks emails:**
- Make sure you're using an App Password, not your regular password
- Enable "Less secure app access" (not recommended)
- Use a different email provider (SendGrid, Mailgun, Amazon SES)

**Emails go to spam:**
- Set up SPF and DKIM records for your domain
- Use a professional email service
- Warm up your email sending reputation gradually

**Queue not processing:**
- Make sure queue worker is running: `php artisan queue:work`
- Check queue configuration in `.env`

## Production Recommendations

1. **Use a professional email service** (SendGrid, Mailgun, Amazon SES) instead of Gmail
2. **Set up email queues** for better performance
3. **Monitor email delivery rates**
4. **Set up logging** for failed emails
5. **Add unsubscribe functionality** if sending marketing emails
6. **Test thoroughly** before deploying to production

## Features

✅ Automated email sending 2-3 days after submission
✅ Beautiful, professional email template
✅ Personalized content with user's name and service details
✅ Complete pricing breakdown
✅ Doctor recommendation with contact info
✅ Mobile-responsive design
✅ Greek language support
✅ Duplicate prevention (emails sent only once)
✅ Customizable send delays
✅ Easy to test and monitor

