# Deployment Guide: Secure Secrets Management

## Backend Deployment (Docker Example)

1. **Prepare your `.env` file** (never commit this to version control):
   ```env
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_key
   # ...other variables as in .env.example
   ```

2. **Run the backend with Docker, loading secrets from the environment:**
   ```sh
   docker build -t invisioned-backend ./backend
   docker run --env-file .env -p 8000:8000 invisioned-backend
   ```

3. **Production (Cloud) Deployment:**
   - Use your cloud provider's secrets manager (e.g., AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) to inject environment variables at runtime.
   - Never store secrets in code or Docker images.

## Frontend Deployment (Next.js Example)

1. **Set environment variables with the `NEXT_PUBLIC_` prefix in your deployment environment.**
2. **For Vercel/Netlify:** Use their dashboard to set environment variables securely.
3. **For Docker:**
   ```sh
   docker build -t invisioned-frontend ./app
   docker run --env-file .env -p 3000:3000 invisioned-frontend
   ```

## Best Practices
- Always use environment variables for secrets.
- Use a secrets manager for production.
- Ensure `.env` is in `.gitignore`.
- Document all required variables in `.env.example`.

---

For more details, see the comments in `backend/settings.py` and your cloud provider's documentation.
