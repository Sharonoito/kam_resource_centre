import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  // Add this block to fix the 'realm_access' error
  interface Profile {
    realm_access?: {
      roles: string[]
    }
  }

  interface Session {
    id_token?: string
    sessionId?: string
    forceLogout?: boolean
    user?: {
      id?: string
      role?: string
      hasSubscription?: boolean
      accessTier?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_token?: string
    userId?: string
    role?: string
    hasSubscription?: boolean
    accessTier?: string
    sessionId?: string
    forceLogout?: boolean
  }
}