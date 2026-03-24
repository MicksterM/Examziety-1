# Quick Start Guide

Get the Examziety landing page running locally in minutes.

## What You Have

✓ Production-ready landing page HTML  
✓ Premium, responsive styling  
✓ Form handling with validation  
✓ Placeholder Stripe integration  
✓ Mobile-optimized design  
✓ Analytics event structure  

## Quick Setup (5 minutes)

### 1. Open the Landing Page

Simply open `index.html` in your browser:

**macOS:**
```bash
open index.html
```

**Windows:**
```bash
start index.html
```

**Or:** Drag `index.html` onto any browser window.

**That's it!** The page is fully functional locally.

### 2. Test the Form

- Scroll down to signup section
- Fill in: Name, Mobile, Email
- Click "Proceed to Payment"
- A modal appears (Stripe integration placeholder)
- Click "Go to Stripe Payment" (currently shows an alert)

### 3. Customize Copy

Open `index.html` in your text editor and search for:

```
Find: "Stop Anxiety From Sabotaging Your Bar Exam"
Replace with: Your headline
```

Common sections to customize:
- `<h1 class="hero-headline">` - Main headline
- All instructor names/bios
- Course dates (search for "May 6" and "June 11")
- Price (search for "$279" or "279")
- Contact email

### 4. Customize Colors

Open `styles.css` and scroll to `:root`:

```css
:root {
    --color-accent: #d4af37;    /* Change gold accent */
    --color-navy: #1a2e4a;      /* Change navy */
    --color-primary: #1a1a1a;   /* Change dark text */
}
```

Change any color and refresh browser to see updates instantly.

## Local Development Server

For better testing (required for Stripe integration):

### Using Python (easiest)

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Using Node.js

```bash
npm install -g http-server
http-server
```

Then open: `http://localhost:8080`

### Using Live Server (VS Code Extension)

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Automatically opens in browser

## File-by-File Quick Reference

### `index.html` - Main content
Search and update:
- Headline/subheadline in hero
- All instructor names/titles/bios
- Course dates and times
- Price
- FAQ questions/answers
- Email addresses

### `styles.css` - Styling
- Colors in `:root` (top of file)
- Typography sizing (search `font-size`)
- Spacing adjustments (search `padding`, `margin`)
- Breakpoints at bottom for responsive design

### `script.js` - Interactivity
- Form validation logic
- Stripe integration (ready for setup)
- Analytics tracking setup
- Smooth scrolling behavior

## Key Customizations

### 1. Change the Accent Color

**Before:**
```css
--color-accent: #d4af37; /* Muted gold */
```

**Options:**
```css
--color-accent: #c4912b; /* Darker gold */
--color-accent: #b8860b; /* Bronze */
--color-accent: #cc6600; /* Warm copper */
--color-accent: #4a90e2; /* Professional blue */
```

### 2. Change Hero Background

**Before:**
```css
background: linear-gradient(135deg, #1a1a1a 0%, #2a2e3a 100%);
```

**Lighter option:**
```css
background: linear-gradient(135deg, #2a2a3a 0%, #3a3e4a 100%);
```

### 3. Add Your Logo

In `index.html` hero section, before headline:

```html
<div style="margin-bottom: 2rem;">
    <img src="your-logo.png" alt="Examziety" style="max-width: 180px;">
</div>
```

Upload `your-logo.png` to same folder.

### 4. Update Email Address

Find every instance of `hello@examziety.com` and replace with your email.

Use Find & Replace (Ctrl/Cmd + H):
- Find: `hello@examziety.com`
- Replace: `youremail@yourdomain.com`

## Mobile Testing

### In Browser DevTools

1. Right-click → "Inspect" (or Cmd+Option+I)
2. Click device toggle (top-left of DevTools)
3. Select different device sizes
4. Page reflows perfectly!

### On Real Phone

1. Get your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. Share link on same WiFi network
3. Open: `http://[YOUR_IP]:8000`
4. Test on actual phone

## Common Edits

### Change course dates

1. Find: `May 6 – June 11`
2. Replace: `Your dates`
3. Also update: `Thursdays, May 6 – June 11` in course-schedule

### Change price

1. Find: `$279`
2. Replace: `$Your_Price`

Search for "279" to find all instances (some in copy, some in pricing details).

### Update instructor info

Each instructor has:
- Name: `<h3>Hugh Comerford</h3>`
- Title: `<p class="instructor-title">Master Practitioner...</p>`
- Bio: `<p class="instructor-bio">With over 40 years...</p>`
- Strength: `<div class="instructor-strength">Specializes in:...</div>`

Update avatar initials too: `<div class="avatar-placeholder">HC</div>`

### Add FAQ items

Copy an existing FAQ item:

```html
<div class="faq-item">
    <h4>Your question here?</h4>
    <p>Your answer here.</p>
</div>
```

Paste in the FAQ grid and update text.

## Performance Check

Open DevTools (F12) → **Lighthouse** tab:
- Click "Analyze page load"
- Should show: 95+ performance, 100 accessibility

If lower:
- Check for image sizes (use compressed images)
- Minimize CSS/JS
- Lazy-load anything below fold

## Browser Compatibility

Works on:
- ✓ Chrome 90+
- ✓ Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Mobile Chrome/Safari
- ✗ Internet Explorer (intentionally not supported)

## Next Steps

1. **Test locally** - Open `index.html`
2. **Customize copy** - Update text and instructor info
3. **Update colors** - Change accent color in `styles.css`
4. **Add images** - Upload instructor photos, logo
5. **Stripe setup** - Follow `STRIPE_SETUP.md` when ready
6. **Deploy** - Push to production host

## Deployment Quick Reference

### Netlify (easiest for static sites)

```bash
npm install -g netlify-cli
netlify deploy
# Follow prompts - done!
```

### GitHub Pages

```bash
git init
git add .
git commit -m "Initial landing page"
git push origin main
# Enable Pages in GitHub repo settings
```

### Traditional Hosting

1. FTP all files to server
2. Open `index.html` in browser via domain
3. Test form and links
4. Done!

## Need Help?

### Landing page looks broken
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+Delete)
- Check that HTML, CSS, and JS files are in same folder
- Open DevTools console (F12) and look for errors

### Form not working
- Check browser console (F12 → Console tab)
- Verify all input field names match
- Test with valid email address

### Mobile looks wrong
- Resize browser smaller to test
- Check DevTools mobile view
- Verify media queries in `styles.css`

### Color changes not showing
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+Delete)
- Check CSS file was saved
- Make sure you edited `:root` section

### Stripe not working
- Normal for now - see `STRIPE_SETUP.md` for full implementation
- Current version shows placeholder modal

---

**That's it!** You have a professional, premium landing page ready to customize.

Questions? Review the specific guide files:
- **README.md** - Full feature documentation
- **STRIPE_SETUP.md** - Payment integration
- **This file** - Quick customization tips

Happy launching! 🚀

---
**Last Updated**: March 23, 2026
