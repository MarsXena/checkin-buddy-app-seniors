Check-In Buddy — SendGrid Update (UI-only workflow)

Files in this zip:
- pages/api/send-email.js  → drop-in API route for Vercel (Next.js)

How to apply using ONLY GitHub UI:
1) In your repo (branch: feat/email-notifications), navigate to /checkin-buddy-seniors/pages/api/
2) Click "Add file" → "Upload files" and upload pages/api/send-email.js from this zip.
   If a file with the same name exists, allow it to be replaced.
3) Edit package.json in GitHub and add the dependency under "dependencies":
     "@sendgrid/mail": "^8.1.0"
   (Keep commas correct. If dependencies were empty, ensure it's a valid JSON object.)
4) In Vercel → Project → Settings → Environment Variables, add:
     SENDGRID_API_KEY = <your key>
     EMAIL_FROM       = Jerushah <your@email.com>  (or a verified sender)
   Note: Do Single Sender Verification or verify a domain in SendGrid.
5) Merge the PR; Vercel will install @sendgrid/mail and deploy.
6) Test the app:
   - Enter a caregiver email on the page
   - Click "Check In" → you should receive the email

Optional:
- Keep the Resend code removed to avoid confusion, or leave only this SendGrid route.
- No local npm needed for this flow.
