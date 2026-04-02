import { Session } from "next-auth"

/**
 * Checks if a user has access to a resource based on their role and subscription status.
 * @param session - The NextAuth session object
 * @param resource - The resource object, must have isFree: boolean
 * @returns boolean
 */
export function checkAccess(session: Session | null, resource: { isFree: boolean }): boolean {
  if (!session || !session.user) return false
  const { role, isSubscribed } = session.user as { role?: string; isSubscribed?: boolean }
  if (["SUPERADMIN", "ADMIN", "KAM_MEMBER"].includes(role || "")) return true
  if (role === "PUBLIC") {
    return resource.isFree || !!isSubscribed
  }
  return false
}
