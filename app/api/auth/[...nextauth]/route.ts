import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

type AppRole = "SUPERADMIN" | "ADMIN" | "KAM_MEMBER" | "PUBLIC"

function resolveRole(role: string | null | undefined): AppRole {
  if (!role) return "PUBLIC"
  if (role === "SUPERADMIN" || role === "ADMIN" || role === "KAM_MEMBER" || role === "PUBLIC") return role as AppRole
  return "PUBLIC"
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  // adapter: PrismaAdapter(prisma), // Commented - manual user create
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // AzureADProvider({ // No creds
    //   clientId: process.env.AZURE_AD_CLIENT_ID!,
    //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    //   tenantId: process.env.AZURE_AD_TENANT_ID!,
    // }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            isSubscribed: true,
            subscriptionExpiry: true,
          }
        })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(credentials.password, user.password!)
        if (!isValid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: resolveRole(user.role),
          isSubscribed: user.isSubscribed ?? false,
          subscriptionExpiry: user.subscriptionExpiry ?? null,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Role-based redirect handled in middleware or client – fallback to /member
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/member`
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && user?.email) {
        const dbUser = await prisma.user.findUnique({ 
          where: { email: user.email! },
          select: { id: true }
        })
        if (!dbUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              role: "PUBLIC",
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, isNewUser }) {
      if (user) {
        token.id = (user as any).id as string
        token.role = resolveRole((user as any).role)
        token.isSubscribed = (user as any).isSubscribed ?? false
        token.subscriptionExpiry = (user as any).subscriptionExpiry ?? null
        return token
      }
      if (!token.role && typeof token.email === "string") {
        const dbUser = await prisma.user.findUnique({ 
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            isSubscribed: true,
            subscriptionExpiry: true,
          }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = resolveRole(dbUser.role)
          token.isSubscribed = dbUser.isSubscribed ?? false
        token.subscriptionExpiry = dbUser.subscriptionExpiry?.toISOString() ?? null
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.role = token.role!
        session.user.isSubscribed = token.isSubscribed!
        session.user.subscriptionExpiry = token.subscriptionExpiry
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

