# BuiltAI Landing Page Setup

## Quick Start (Local Preview)

Just open `index.html` in your browser. The form will work in "dev mode" (logs to console instead of saving to database).

## Supabase Setup (5 minutes)

### 1. Create a Supabase project
- Go to [supabase.com](https://supabase.com) and sign up / log in
- Click "New Project"
- Name it something like `builtai-leads`
- Set a database password (save this somewhere)
- Wait for project to spin up (~2 min)

### 2. Create the leads table
Go to **SQL Editor** in your Supabase dashboard and run:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  use_case text,
  timeline text,
  submitted_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow anonymous inserts (for the form)
create policy "Allow anonymous inserts" on leads
  for insert with check (true);
```

### 3. Get your API credentials
- Go to **Settings → API** in your Supabase dashboard
- Copy:
  - **Project URL** (e.g., `https://abc123.supabase.co`)
  - **anon public** key (the long string)

### 4. Add credentials to app.js
Open `app.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:

```javascript
const SUPABASE_URL = 'https://abc123.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJI...your-key-here';
```

### 5. Deploy

**Vercel (easiest):**
```bash
npm i -g vercel
cd builtai-landing
vercel
```

**Netlify:**
- Drag and drop the `builtai-landing` folder to [netlify.com/drop](https://app.netlify.com/drop)

**GitHub Pages:**
- Push to a repo, enable Pages in settings

## Viewing Leads

- Go to **Table Editor → leads** in Supabase to see submissions
- Or use SQL: `select * from leads order by submitted_at desc;`
- Export as CSV anytime from the Table Editor

## Optional: Email Notifications

To get emailed when someone submits:
1. Go to **Database → Webhooks** in Supabase
2. Create a webhook on `leads` table for `INSERT`
3. Point it to a service like [Make.com](https://make.com) or [Zapier](https://zapier.com) to send you an email

## File Structure

```
builtai-landing/
├── index.html    # Main page
├── styles.css    # Styling
├── app.js        # Form handling + Supabase
└── SETUP.md      # This file
```
