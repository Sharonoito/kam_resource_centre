import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.id_token = account.id_token
      }

      // 1. Fix: Ensure profile is treated as the extended type from your .d.ts
      if (profile) {
        // We explicitly define roles to avoid the "implicitly has any type" error for 'r'
        const roles: string[] = profile.realm_access?.roles || [];
        
        token.role = roles.find(r => r === 'superadmin') 
          ? 'SUPERADMIN' 
          : roles.includes('member') 
            ? 'MEMBER' 
            : 'PUBLIC';
      }
      
      return token
    },

    async session({ session, token }) {
      session.id_token = token.id_token as string;
      
      // 2. Fix: Check if session.user exists to resolve "possibly undefined" error
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      
      return session;
    },
  },
})

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