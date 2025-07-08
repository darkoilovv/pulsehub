import { Account, Client } from "appwrite"

export async function createJWT() {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  
    const account = new Account(client)
  
    try {
      const response = await account.createJWT()
      console.log('JWT response:', response);
      return response.jwt
    } catch (error) {
      console.error('JWT creation failed:', error)
      return null
    }
  }