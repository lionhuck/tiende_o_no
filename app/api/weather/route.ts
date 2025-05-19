import { NextResponse } from "next/server"

/**
 * Validates the OpenWeatherMap API key format
 * @param apiKey The API key to validate
 * @returns An object with validation result and error message if invalid
 */
function validateApiKey(apiKey: string | undefined): { isValid: boolean; message?: string } {
  // Check if API key exists
  if (!apiKey) {
    return {
      isValid: false,
      message: "API key is missing. Make sure OPENWEATHER_API_KEY is set in your environment variables.",
    }
  }

  // Check if API key has reasonable length (OpenWeatherMap keys are typically 32 chars)
  if (apiKey.length < 20) {
    return {
      isValid: false,
      message: "API key appears to be too short. OpenWeatherMap API keys are typically 32 characters long.",
    }
  }

  // Check if API key contains only valid characters (hexadecimal)
  const validKeyRegex = /^[a-zA-Z0-9]+$/
  if (!validKeyRegex.test(apiKey)) {
    return {
      isValid: false,
      message: "API key contains invalid characters. API keys should only contain letters and numbers.",
    }
  }

  return { isValid: true }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  // Get API key from environment variables
  const apiKey = process.env.OPENWEATHER_API_KEY

  // Validate API key
  const keyValidation = validateApiKey(apiKey)
  if (!keyValidation.isValid) {
    console.error(keyValidation.message)
    return NextResponse.json({ error: keyValidation.message }, { status: 500 })
  }

  try {
    // Log the API request URL (without the full API key for security)
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey!.substring(0, 3)}...&lang=es`
    console.log(`Fetching weather data from: ${apiUrl}`)

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}&lang=es`,
      { cache: "no-store" }, // Disable caching to ensure fresh data
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details available")
      console.error(`OpenWeatherMap API error: Status ${response.status}, Details: ${errorText}`)

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Error de autenticación con la API del clima. Verifica tu API key.",
          },
          { status: 401 },
        )
      }

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "Ciudad no encontrada. Intenta con otro nombre.",
          },
          { status: 404 },
        )
      }

      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      {
        error: "No se pudieron obtener los datos del clima. Intenta nuevamente más tarde.",
      },
      { status: 500 },
    )
  }
}
