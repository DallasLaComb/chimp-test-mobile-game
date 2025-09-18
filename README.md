# chimp-test-mobile-game

A React Native notes app with Supabase authentication and AWS backend.

## Setup

1. **Supabase Setup:**
   - Create a Supabase project
   - Run the SQL in `supabase-schema.sql` in your Supabase SQL editor
   - Get your project URL and anon key

2. **Environment Variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add API Gateway URL after deployment

3. **Deploy Backend:**
   - Set GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`
   - Push to master branch to trigger deployment

4. **Run App:**
   ```bash
   npm install
   npm start
   ```