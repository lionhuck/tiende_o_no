import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Validate API key format
    const validKeyRegex = /^[a-zA-Z0-9]+$/
    if (!validKeyRegex.test(apiKey) || apiKey.length < 20) {
      return NextResponse.json({ error: "Invalid API key format" }, { status: 400 })
    }

    // In a real application, you would store this in a secure way
    // For this demo, we'll use cookies or local storage
    // Note: In production, you should use a more secure approach

    // For now, we'll just return success
    // In a real app, you might set this in a database or environment variable

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting API key:", error)
    return NextResponse.json({ error: "Failed to set API key" }, { status: 500 })
  }
}
