import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      role?: string
      isSubscribed?: boolean
      subscriptionExpiry?: string | null
    } & DefaultSession["user"]
  }

  interface Profile {
    realm_access?: {
      roles: string[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    isSubscribed?: boolean
    subscriptionExpiry?: string | null
  }
}

