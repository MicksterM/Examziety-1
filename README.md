# Examziety Landing Page

A premium, high-converting landing page for Examziety—a 10-week live Zoom course designed to help bar exam candidates manage and overcome anxiety.

## Overview

This landing page is built to convert anxious law graduates and bar exam takers into course participants. It features:

- **Premium Design**: Dark palette (navy, charcoal), gold accents, elegant typography. Feels like high-end executive coaching.
- **Persuasive Copy**: Speaks directly to the anxiety experience, addresses objections, and builds credibility.
- **Full Conversion Flow**: From hero section through signup form to Stripe payment.
- **Responsive Design**: Mobile-friendly across all device sizes.
- **Analytics Ready**: Placeholder structure for event tracking.

## File Structure

```
examziety/
├── index.html          # Main landing page markup
├── styles.css          # Premium styling and responsive design
├── script.js           # Form handling, analytics, interactivity
├── README.md           # This file
└── STRIPE_SETUP.md     # Stripe integration instructions
```

## Key Sections

1. **Hero Section** - Strong headline, subheadline, credibility signal
2. **Problem Section** - Emotional resonance: "You've done the work, but anxiety..."
3. **Solution Section** - Introduces Examziety as the solution
4. **Benefits Section** - Card grid: Emotional, Practical, Confidence, Lifetime Skills
5. **Instructors Section** - Credibility-building bios with avatar placeholders
6. **How It Works** - Course format, schedule, details
7. **FAQ / Objections** - Addresses 8 key objections professionally
8. **Pricing Section** - $279 with value prop
9. **Signup Section** - Form collection: Name, Mobile, Email
10. **Disclaimer Section** - Legal/ethical messaging about no guarantee
11. **Final CTA** - Emotional closing with strong enrollment prompt
12. **Footer** - Contact info and links

## Design System

### Colors
- **Primary**: `#1a1a1a` (Dark charcoal)
- **Navy**: `#1a2e4a` (Professional depth)
- **Accent**: `#d4af37` (Muted gold—premium feel)
- **Backgrounds**: `#ffffff` (White), `#f5f3f0` (Ivory)
- **Text**: `#5a5a5a` (Dark grey)

### Typography
- **Serif** (Headlines): Georgia, Garamond
- **Sans-serif** (Body): System fonts (SF Pro, Segoe UI, etc.)
- Scale: 3.5rem (h1) → 1rem (body)

### Spacing
- 6-level spacing scale for consistency
- Generous whitespace for luxury feel
- Mobile: Reduced padding and font sizes

### Interactions
- Smooth scrolling to sections
- Hover effects on cards (elevation + shadow)
- Form focus states (accent color outline)
- Fade-in animations on scroll
- Stripe payment modal

## Customization Guide

### Editing Copy

All copy is semantic and easy to find. Key sections:

```html
<!-- Hero headline -->
<h1 class="hero-headline">Stop Anxiety From Sabotaging Your Bar Exam</h1>

<!-- Problem cards -->
<h3>The Panic Hits When It Matters Most</h3>

<!-- Instructor names/titles -->
<h3>Hugh Comerford</h3>
<p class="instructor-title">Master Practitioner & NLP Trainer</p>
```

### Updating Course Details

Find these easily searchable sections:

- **Course Schedule**: Lines with "May 6" and "June 11" in `how-it-works` section
- **Price**: "$279" appears in pricing section
- **Duration**: "10-week" throughout
- **Format**: "Live Zoom course"

To change dates or price:
1. Use Find & Replace (Ctrl/Cmd + H) for the date/price
2. Update the schedule detail in the "How the course works" section
3. Test responsiveness on mobile

### Instructor Avatars

Currently showing initials (HC, KK, MM) with gold gradient background.

**To add real photos:**
```html
<!-- Replace this: -->
<div class="avatar-placeholder">HC</div>

<!-- With this: -->
<img src="hugh-comerford.jpg" alt="Hugh Comerford" class="instructor-avatar">
```

Then add CSS:
```css
.instructor-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
}
```

### Color Customization

All colors are in the `:root` CSS variables. To change:

1. Open `styles.css`
2. Find `:root { ... }` at the top
3. Modify values like:
   ```css
   --color-accent: #d4af37; /* Change gold */
   --color-navy: #1a2e4a;   /* Change navy */
   ```

The entire page will update automatically.

### Email Contact

To activate email links:
```html
<!-- Replace: -->
<a href="mailto:hello@examziety.com">hello@examziety.com</a>

<!-- With your actual email -->
```

## Form & Signup Flow

### Current Flow

1. User fills out form (Name, Mobile, Email)
2. Form validates on submit
3. Data saved to localStorage
4. Payment modal appears
5. User clicks "Go to Stripe Payment"
6. Ready for Stripe integration

### Stripe Integration Setup

See `STRIPE_SETUP.md` for complete instructions on:
- Creating Stripe products
- Setting up Stripe Checkout
- Connecting payment processing
- Handling post-payment redirects

**Quick placeholder:** The Stripe button currently triggers an alert. Before going live, implement Stripe integration.

### Form Validation

- Required fields: name, mobile, email
- Email validation built-in (HTML5)
- Visual feedback on input (gold border on focus)
- Mobile number accepts any format

To add server-side validation:
```javascript
// In script.js, update the form submission handler:
const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

## Analytics Integration

The page has placeholder structure for analytics. To connect:

### Google Analytics
```html
<!-- Add to <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Mixpanel
```html
<script>
  (function(f){if(!f.__SV){var e=window.mixpanel;if(e.__SV){return;}var n=window.mixpanel;window.mixpanel=[function(){n.push(arguments)}];(window.mixpanel).push=function(){n.push(arguments);};window.mixpanel.identify=function(){n.identify.apply(n,arguments);};...
  // Use Mixpanel dashboard to get tracking code
</script>
```

### Events Tracked

The page auto-tracks:
- `page_load` - When page loads
- `section_viewed` - When user scrolls to each section
- `cta_clicked` - When any CTA button clicked
- `signup_started` - When form submitted

All event data is logged to console (dev mode only).

## Responsive Breakpoints

- **Desktop**: 1200px max-width
- **Tablet**: 768px breakpoint
- **Mobile**: 480px breakpoint

Test on multiple devices. Every section reflows gracefully:
- Multi-column grids → single column on mobile
- Hero layout shifts from side-by-side to stacked
- Form inputs stay large and touchable

## Performance Optimization

- Minimal dependencies (vanilla HTML/CSS/JS)
- No image bloat (uses CSS gradients and icons)
- CSS Grid/Flexbox for efficient layout
- Smooth animations use CSS transitions
- Fast page load: <1s on good connection

## SEO & Meta Tags

Basic SEO structure included. To enhance:

```html
<meta name="description" content="Examziety - Master bar exam anxiety...">
<meta name="keywords" content="bar exam, anxiety, Zoom course, NLP, hypnotherapy">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Examziety | Master Bar Exam Anxiety">
<meta property="og:description" content="...">
<meta property="og:image" content="examziety-og-image.jpg">
```

Add these to `<head>` for better sharing.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

No IE support (intentional—targeting modern professional audience).

## Accessibility

- Semantic HTML5 structure
- Color contrast ratios meet WCAG AA
- Form labels properly associated
- Focus states visible
- Alt text ready for images

To improve:
- Add `alt` tags to any images
- Test with screen readers (NVDA, JAWS)
- Verify keyboard navigation

## Deployment

### Simple Deployment (No Backend)

1. Upload all files to web host
2. Update Stripe link in `script.js`
3. Test form submission and payment flow

### With Backend

1. Create API endpoint at `/api/signup`
2. Uncomment fetch code in `script.js`
3. Store leads in database
4. Handle post-payment redirects
5. Send confirmation emails

### Via Netlify/Vercel

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

### Via GitHub Pages

1. Push to GitHub repo
2. Go to Settings → Pages
3. Select main branch as source
4. Site publishes automatically

## Troubleshooting

### Form not submitting
- Check browser console for errors
- Verify all input fields have `name` attributes
- Ensure form has `id="signupForm"`

### Styling looks broken
- Clear browser cache (Ctrl/Cmd + Shift + R)
- Verify `styles.css` file path is correct in HTML
- Check for CSS file conflicts

### Stripe not working
- See `STRIPE_SETUP.md`
- Verify API keys are correct
- Check CORS settings if redirecting

### Mobile layout issues
- Test on real device or DevTools
- Check media queries are correct
- Verify viewport meta tag exists

## Support & Questions

This landing page is designed to be self-contained and customizable. 

For questions on:
- **Design/Copy**: Review sections above
- **Stripe**: See STRIPE_SETUP.md
- **Hosting**: Contact your web host
- **Custom features**: Extend script.js as needed

## License

This landing page is custom-built for Examziety and proprietary.

---

**Last Updated**: March 23, 2026
**Version**: 1.0
