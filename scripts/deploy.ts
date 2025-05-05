import { exec } from "child_process"
import util from "util"

const execPromise = util.promisify(exec)

async function deploy() {
  try {
    // Build the application
    console.log("Building application...")
    await execPromise("npm run build")

    // Run database migrations
    console.log("Running database migrations...")
    await execPromise("npx tsx scripts/migrate-db.ts")

    // Deploy to Vercel
    console.log("Deploying to Vercel...")
    await execPromise("vercel --prod")

    console.log("Deployment completed successfully!")
  } catch (error) {
    console.error("Deployment failed:", error)
    process.exit(1)
  }
}

deploy()
