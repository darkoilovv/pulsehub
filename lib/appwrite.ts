import { Account, Client, Databases } from "appwrite"

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

console.log(endpoint, project)

if (!endpoint || !project) {
  throw new Error("Appwrite environment variables are missing")
}

const client = new Client().setEndpoint(endpoint).setProject(project)

// Export the account instance
export const account = new Account(client)

// Export the database instance
export const databases = new Databases(client)

// Export the client for further use
export { client }
