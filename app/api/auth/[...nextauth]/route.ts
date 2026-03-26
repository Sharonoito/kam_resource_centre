import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import prisma from "@/lib/prisma"

type AppRole = "SUPERADMIN" | "ADMIN" | "MEMBER" | "PUBLIC"
type AccessTier = "ADMIN" | "MEMBER_FULL" | "PUBLIC_FREE_ONLY" | "PUBLIC_FULL"

function extractRolesFromIdToken(idToken?: string | null): string[] {
  if (!idToken) return []

  try {
    const [, payload] = idToken.split(".")
    if (!payload) return []

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      realm_access?: { roles?: string[] }
    }

    return Array.isArray(decoded.realm_access?.roles)
      ? decoded.realm_access!.roles!
      : []
  } catch {
    return []
  }
}

function resolveRole(roles: string[]): AppRole {
  if (roles.includes("superadmin")) return "SUPERADMIN"
  if (roles.includes("admin")) return "ADMIN"
  if (roles.includes("member")) return "MEMBER"
  return "PUBLIC"
}

function resolveAccessTier(role: string, hasSubscription: boolean): AccessTier {
  if (role === "SUPERADMIN" || role === "ADMIN") return "ADMIN"
  if (role === "MEMBER") return "MEMBER_FULL"
  return hasSubscription ? "PUBLIC_FULL" : "PUBLIC_FREE_ONLY"
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.id_token = account.id_token
      }

      const rolesFromProfile: string[] = profile?.realm_access?.roles || []
      const rolesFromIdToken = extractRolesFromIdToken(
        (account?.id_token as string | undefined) ?? (token.id_token as string | undefined)
      )
      const effectiveRoles = Array.from(new Set([...rolesFromIdToken, ...rolesFromProfile]))
      const resolvedRole = resolveRole(effectiveRoles)

      if (effectiveRoles.length > 0) {
        token.role = resolvedRole
      }

      if (token.email) {
        const email = token.email.toLowerCase()
        const currentSessionId = token.sub ?? null

        if (account) {
          const role = effectiveRoles.includes("superadmin")
            ? "SUPERADMIN"
            : ((token.role as string) || "PUBLIC")

          const user = await prisma.user.upsert({
            where: { email },
            update: {
              name: token.name ?? undefined,
              role,
            },
            create: {
              email,
              name: token.name ?? undefined,
              role,
            },
            select: {
              id: true,
              role: true,
            },
          })

          await prisma.$executeRaw`
            UPDATE public.users
            SET
              current_session_id = ${currentSessionId},
              has_subscription = COALESCE(has_subscription, false)
            WHERE email = ${email}
          `

          const [accessRow] = await prisma.$queryRaw<Array<{
            has_subscription: boolean | null
          }>>`
            SELECT has_subscription
            FROM public.users
            WHERE email = ${email}
            LIMIT 1
          `

          const hasSubscription = Boolean(accessRow?.has_subscription)

          token.userId = user.id
          token.sessionId = currentSessionId ?? undefined
          token.role = user.role
          token.hasSubscription = hasSubscription
          token.accessTier = resolveAccessTier(user.role, hasSubscription)
          token.forceLogout = false
        } else if (currentSessionId) {
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              role: true,
            },
          })

          if (!user) {
            token.forceLogout = true
            return token
          }
          const [accessRow] = await prisma.$queryRaw<Array<{
            has_subscription: boolean | null
            current_session_id: string | null
          }>>`
            SELECT has_subscription, current_session_id
            FROM public.users
            WHERE email = ${email}
            LIMIT 1
          `

          const hasSubscription = Boolean(accessRow?.has_subscription)
          const dbSessionId = accessRow?.current_session_id ?? null

          token.userId = user.id
          token.role = user.role
          token.hasSubscription = hasSubscription
          token.accessTier = resolveAccessTier(user.role, hasSubscription)
          token.forceLogout = Boolean(
            dbSessionId && dbSessionId !== currentSessionId
          )
          token.sessionId = currentSessionId
        } else {
          const role = (token.role as string) || "PUBLIC"
          token.hasSubscription = false
          token.accessTier = resolveAccessTier(role, false)
          token.forceLogout = false
        }
      }

      return token
    },

    async session({ session, token }) {
      session.id_token = token.id_token as string

      if (token.role && session.user) {
        session.user.role = token.role as string
      }

      if (session.user) {
        session.user.id = token.userId as string | undefined
        session.user.hasSubscription = Boolean(token.hasSubscription)
        session.user.accessTier = token.accessTier as string | undefined
      }

      session.sessionId = token.sessionId as string | undefined
      session.forceLogout = Boolean(token.forceLogout)

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// import NextAuth from "next-auth"
// import KeycloakProvider from "next-auth/providers/keycloak"

// const handler = NextAuth({
//   providers: [
//     KeycloakProvider({
//       clientId: process.env.KEYCLOAK_CLIENT_ID!,
//       clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
//       issuer: process.env.KEYCLOAK_ISSUER!,
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account) {
//         token.id_token = account.id_token
//         // Parse role from Keycloak profile/groups (adjust path as per your Keycloak config)
//         if (profile) {
//           token.role = profile.realm_access?.roles?.find(r => r === 'superadmin') ? 'SUPERADMIN' : 
//                       profile.realm_access?.roles?.includes('member') ? 'MEMBER' : 'PUBLIC'
//         }
//       }
//       return token
//     },

//     async session({ session, token }) {
//       session.id_token = token.id_token as string
//       if (token.role) {
//         session.user.role = token.role as string
//       }
//       return session
//     },
//   },
// })

// export { handler as GET, handler as POST }


// import NextAuth from "next-auth"
// import KeycloakProvider from "next-auth/providers/keycloak"

// const handler = NextAuth({
//   providers: [
//     KeycloakProvider({
//       clientId: process.env.KEYCLOAK_CLIENT_ID!,
//       clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
//     //   issuer: "http://localhost:8080/realms/kam-realm",
//       issuer: "http://localhost:8080/realms/KAM",
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// })

// export { handler as GET, handler as POST }