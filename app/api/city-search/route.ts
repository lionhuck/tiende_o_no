import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const limit = searchParams.get("limit") || "5"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Get API key from environment variables (server-side only)
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Make the geocoding request server-side
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    // Format the response to include only the necessary information
    const formattedData = data.map((city: any) => ({
      name: city.name,
      state: city.state || "",
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      displayName: `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("City search error:", error)
    return NextResponse.json({ error: "No se pudieron obtener resultados de búsqueda" }, { status: 500 })
  }
}
