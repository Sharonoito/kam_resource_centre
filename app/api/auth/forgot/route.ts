import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // TODO: Send reset email with nodemailer
    console.log(`Reset password for: ${email}`)
    // Generate token, save to DB, email link /reset?token=...

    return NextResponse.json({ message: "Reset link sent to your email" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

