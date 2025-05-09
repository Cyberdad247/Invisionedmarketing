import { exec } from "child_process"

const LOG_BUILDING_APP = "Building application...";
const CMD_BUILD_APP = "npm run build";
const LOG_RUNNING_MIGRATIONS = "Running database migrations with safeguards...";
const CMD_RUN_MIGRATIONS = "npx tsx scripts/safe-migrate-db.ts";
const LOG_MIGRATIONS_COMPLETE = "✅ Database migrations completed";
const LOG_MIGRATION_WARNING = "⚠️ Migration warning:";
const LOG_CONTINUING_DEPLOYMENT_POST_MIGRATION_ISSUE = "Continuing with deployment despite migration issues";
const FILE_MIGRATION_ERROR_LOG = "migration-error.log";
const FILE_APPEND_FLAG = "a";
const LOG_DEPLOYING_TO_VERCEL = "Deploying to Vercel...";
const CMD_DEPLOY_TO_VERCEL = "vercel --prod";
const LOG_DEPLOYMENT_COMPLETE = "Deployment completed successfully!";
const LOG_DEPLOYMENT_FAILED = "Deployment failed:";
import util from "util"
import fs from "fs"

const execPromise = util.promisify(exec)

async function deploy() {
  try {
    // Build the application
    console.log(LOG_BUILDING_APP)
    await execPromise(CMD_BUILD_APP)

    // Run database migrations with safeguards
    console.log(LOG_RUNNING_MIGRATIONS)
    try {
      await execPromise(CMD_RUN_MIGRATIONS)
      console.log(LOG_MIGRATIONS_COMPLETE)
    } catch (migrationError) {
      console.error(LOG_MIGRATION_WARNING, migrationError)
      // Continue with deployment even if migrations fail
      // This allows new code to deploy even if DB changes aren't ready
      console.log(LOG_CONTINUING_DEPLOYMENT_POST_MIGRATION_ISSUE)

      // Write migration error to log file for later investigation
      fs.writeFileSync(FILE_MIGRATION_ERROR_LOG, `Migration error at ${new Date().toISOString()}:\n${migrationError}\n`, {
        flag: FILE_APPEND_FLAG,
      })
    }

    // Deploy to Vercel
    console.log(LOG_DEPLOYING_TO_VERCEL)
    await execPromise(CMD_DEPLOY_TO_VERCEL)

    console.log(LOG_DEPLOYMENT_COMPLETE)
  } catch (error) {
    console.error(LOG_DEPLOYMENT_FAILED, error)
    process.exit(1)
  }
}

deploy()
