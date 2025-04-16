import { Client, Account } from 'appwrite'

export async function getCurrentUser(jwt: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setJWT(jwt)

  const account = new Account(client)

  try {
    const user = await account.get()
    return user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null
  }
}
