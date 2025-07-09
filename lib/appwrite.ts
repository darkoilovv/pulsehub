import { Account, Client, Databases, Storage, Functions, Teams } from "appwrite"

const client = new Client()

client
    .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT))
    .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID))

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)
const functions = new Functions(client)
const teams = new Teams(client)


export { client, account, databases, storage, functions, teams }