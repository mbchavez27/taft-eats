/**
 * @fileoverview Entry point for the server application. Initializes environment variables,
 * verifies the database connection, and starts the Express server.
 * @module server
 */

import dotenv from 'dotenv'
import app from './src/app.ts'
import { checkDatabaseConnection } from './src/shared/config/database.ts'

dotenv.config()

/**
 * The port number the server will listen on.
 * Falls back to 3000 if not specified in the environment variables.
 * @constant {number | string} PORT
 */
const PORT = process.env.PORT || 3000

/**
 * Bootstraps the application by checking the database connection
 * and starting the Express server listening on the configured port.
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  await checkDatabaseConnection()

  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    )
  })
}

startServer()
