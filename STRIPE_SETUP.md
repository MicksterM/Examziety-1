# Stripe Integration Guide for Examziety

This guide walks you through integrating Stripe payment processing into the Examziety landing page. The current implementation has a placeholder; this guide covers production-ready setup.

## Overview

**What we're building:**
1. User fills signup form (Name, Mobile, Email)
2. Form data sent to backend
3. Backend creates Stripe Checkout session
4. User redirected to Stripe Checkout
5. User pays $279
6. Success page or email confirmation
7. Lead data stored in database

## Prerequisites

- Stripe account (free tier works for testing)
- Backend server (Node.js + Express recommended)
- Database (optional but recommended for lead tracking)
- SSL certificate on live domain (Stripe required)

## Step 1: Stripe Account & API Keys

1. Go to [stripe.com](https://stripe.com)
2. Create account (business email)
3. Verify email
4. Go to **Dashboard** → **Developers** → **API Keys**
5. You'll see:
   - **Publishable Key** (public, safe to share)
   - **Secret Key** (KEEP PRIVATE, never expose in frontend)

### Test vs Live Mode

- **Test Mode** (default): Use test card `4242 4242 4242 4242`, any expiry, any CVC
- **Live Mode**: Real payment processing (after verification)

Keep test keys visible in original guide for safety.

## Step 2: Frontend Setup (HTML Update)

Add Stripe.js library to your `index.html` in the `<head>`:

```html
<script src="https://js.stripe.com/v3/"></script>
```

Update the form submission in `script.js` (see Step 3).

## Step 3: Backend Setup (Node.js + Express)

### Install Dependencies

```bash
npm init -y
npm install express stripe cors dotenv
npm install --save-dev nodemon
```

### Create `.env` file

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Create `server.js`

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// ========== ENDPOINTS ==========

// Create Checkout Session
app.post('/api/checkout-session', async (req, res) => {
    const { name, email, mobile } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Examziety Course',
                            description: '10-week live Zoom course for bar exam anxiety management',
                            images: ['https://your-domain.com/examziety-preview.jpg'], // Optional
                        },
                        unit_amount: 27900, // $279 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: email,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancelled`,
            
            // Pre-fill customer info
            customer_creation: 'always',
            
            // Custom metadata for your records
            metadata: {
                name: name,
                mobile: mobile,
                timestamp: new Date().toISOString()
            },
            
            // Billing address collection
            billing_address_collection: 'required',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook for post-payment events
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            
            // Save to database
            await saveEnrollment({
                name: session.metadata.name,
                email: session.email,
                mobile: session.metadata.mobile,
                sessionId: session.id,
                paymentStatus: 'completed',
                amount: session.amount_total / 100, // Convert cents to dollars
                timestamp: new Date()
            });

            // Send confirmation email (optional)
            await sendConfirmationEmail(session.email, session.metadata.name);
            
            console.log(`Payment received: ${session.email}`);
            break;

        case 'charge.refunded':
            console.log('Refund processed');
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({received: true});
});

// Verify session (after successful payment)
app.post('/api/verify-session', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({
            status: session.payment_status,
            email: session.email,
            amount: session.amount_total / 100
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== DATABASE INTEGRATION ==========

// This is a placeholder - implement with your database
async function saveEnrollment(enrollmentData) {
    // Example with MongoDB/Mongoose:
    // const enrollment = new Enrollment(enrollmentData);
    // await enrollment.save();
    
    // Example with PostgreSQL/Sequelize:
    // await Enrollment.create(enrollmentData);
    
    console.log('Enrollment saved:', enrollmentData);
}

// ========== EMAIL INTEGRATION ==========

// This is a placeholder - use SendGrid, Mailgun, or similar
async function sendConfirmationEmail(email, name) {
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //     to: email,
    //     from: 'hello@examziety.com',
    //     subject: 'Welcome to Examziety!',
    //     html: `Hi ${name}, thanks for enrolling...`
    // });
    
    console.log(`Confirmation email would be sent to ${email}`);
}

// ========== SERVER START ==========

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Examziety server running on port ${PORT}`);
});
```

### Update `package.json` scripts

```json
{
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
    }
}
```

### Run Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

## Step 4: Frontend Integration (Update `script.js`)

Replace the form submission handler in `script.js` with:

```javascript
const signupForm = document.getElementById('signupForm');
const paymentModal = document.getElementById('paymentModal');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;

    // Show loading state
    const submitButton = signupForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
        // Create Stripe Checkout session
        const response = await fetch('http://localhost:4000/api/checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, mobile })
        });

        const { sessionId } = await response.json();

        if (!sessionId) {
            throw new Error('Failed to create checkout session');
        }

        // Redirect to Stripe Checkout
        const stripe = Stripe('pk_test_your_publishable_key_here');
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error('Stripe error:', error);
            alert('Payment error. Please try again.');
        }

    } catch (error) {
        console.error('Signup error:', error);
        alert('There was an issue processing your signup. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});
```

## Step 5: Success & Cancellation Pages

### Create `success.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Confirmed - Examziety</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body style="text-align: center; padding: 4rem; background: linear-gradient(135deg, #1a1a1a 0%, #2a2e3a 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 600px;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #d4af37;">Success!</h1>
        <p style="font-size: 1.25rem; margin-bottom: 2rem;">Your enrollment in Examziety is confirmed.</p>
        <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.9;">Check your email for course details, Zoom link, and next steps.</p>
        <a href="/" style="background: #d4af37; color: #1a1a1a; padding: 1rem 2rem; border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block;">Return to Home</a>
    </div>
</body>
</html>
```

### Create `cancelled.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Cancelled - Examziety</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body style="text-align: center; padding: 4rem; background: linear-gradient(135deg, #1a1a1a 0%, #2a2e3a 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 600px;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Payment Cancelled</h1>
        <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.9;">Your payment was not processed. No charges were made to your account.</p>
        <a href="/#signup" style="background: #d4af37; color: #1a1a1a; padding: 1rem 2rem; border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block;">Try Again</a>
    </div>
</body>
</html>
```

## Step 6: Stripe Webhook Setup

Stripe needs to confirm payment. Set up webhook:

1. **Development (Local Testing):**
   - Install Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Forward events: `stripe listen --forward-to localhost:4000/api/webhook`
   - Get signing secret: `stripe listen` will show it
   - Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

2. **Production:**
   - Go to Stripe Dashboard → **Developers** → **Webhooks**
   - Add endpoint: `https://yourdomain.com/api/webhook`
   - Select events: `checkout.session.completed`
   - Copy webhook secret to `.env`

## Step 7: Database Setup (Optional but Recommended)

### MongoDB Example

```bash
npm install mongoose
```

Create `models/Enrollment.js`:

```javascript
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    sessionId: String,
    paymentStatus: String,
    amount: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
```

In `server.js`:

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Enrollment = require('./models/Enrollment');

async function saveEnrollment(enrollmentData) {
    const enrollment = new Enrollment(enrollmentData);
    await enrollment.save();
}
```

## Step 8: Deploy to Production

### Environment Variables

Before deploying, set up production environment:

1. **Stripe**: Switch to Live keys in Stripe Dashboard
2. **Create `.env.production`:**
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   FRONTEND_URL=https://examziety.com
   PORT=3000
   ```

### Deployment Platforms

**Heroku:**
```bash
heroku create examziety
heroku config:set STRIPE_SECRET_KEY=sk_live_...
git push heroku main
```

**Vercel:**
```bash
vercel --prod
# Add env vars in Vercel dashboard
```

**Railway/Render:**
Same approach—set env vars in dashboard.

## Testing Checklist

- [ ] Stripe account created
- [ ] API keys generated
- [ ] `.env` configured
- [ ] Server running locally
- [ ] Frontend form connects to backend
- [ ] Stripe Checkout launches on submit
- [ ] Test payment completed with `4242 4242 4242 4242`
- [ ] Webhook received payment confirmation
- [ ] Success page displays
- [ ] Database stored enrollment
- [ ] Confirmation email sent (if configured)

## Test Cards

Use these in Stripe test mode:

| Card | Number | CVC | Date |
|------|--------|-----|------|
| Visa | 4242 4242 4242 4242 | Any | Any future |
| Visa (declined) | 4000 0000 0000 0002 | Any | Any future |
| Amex | 3782 822463 10005 | Any | Any future |

## Troubleshooting

### "Invalid API Key"
- Check you copied the correct key
- Ensure key matches test/live mode
- Verify `.env` file is loaded

### Payment modal doesn't open
- Check browser console for errors
- Verify Stripe publishable key
- Check frontend is calling correct endpoint

### Webhook not triggering
- Verify endpoint URL is correct
- Check webhook secret in `.env`
- Use `stripe listen` locally for testing

### Customer not receiving confirmation email
- Check email service API key
- Verify email template exists
- Check spam folder

## Security Best Practices

1. **Never expose secret key** in frontend
2. **Use HTTPS only** on production
3. **Validate payments** server-side always
4. **Rate limit** signup endpoint
5. **Sanitize** all user inputs
6. **Log transactions** securely

## Next Steps

1. [ ] Complete Stripe setup above
2. [ ] Deploy server to production
3. [ ] Update frontend with live Stripe key
4. [ ] Test full payment flow
5. [ ] Set up email confirmations
6. [ ] Configure webhook signing
7. [ ] Monitor for payment issues

---

**Support**: Contact Stripe support or review [stripe.com/docs](https://stripe.com/docs) for advanced features.

**Last Updated**: March 23, 2026
