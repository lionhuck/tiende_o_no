import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude parameters are required" }, { status: 400 })
  }

  try {
    // Get API key from environment variables (server-side only)
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Make the reverse geocoding request server-side
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    let cityName = "Tu ubicación"

    if (data && data.length > 0) {
      cityName = data[0].name
    }

    return NextResponse.json({ cityName })
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json({ error: "No se pudo obtener el nombre de la ciudad" }, { status: 500 })
  }
}
