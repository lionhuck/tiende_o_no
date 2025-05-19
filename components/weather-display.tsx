"use client"

import {
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  Check,
  X,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WeatherDisplayProps {
  weather: any
  expandedSection: string | null
  toggleSection: (section: string) => void
}

export default function WeatherDisplay({ weather, expandedSection, toggleSection }: WeatherDisplayProps) {
  // Modificar la función processWeatherDecision para ignorar si es de noche o no
  const processWeatherDecision = () => {
    const warnings: string[] = []
    let canHang = true
    let message = "¡Podés colgar la ropa!"
    const reasons: string[] = []

    // Check for rain
    if (
      weather.weather[0].main === "Rain" ||
      weather.weather[0].main === "Drizzle" ||
      weather.weather[0].main === "Thunderstorm"
    ) {
      canHang = false
      reasons.push("Está lloviendo")
    }

    // Eliminamos la verificación de si es de noche
    // Ya no consideramos el horario como factor para la decisión

    // Check cloud coverage - affects solar radiation
    if (weather.clouds && weather.clouds.all > 80) {
      if (canHang) {
        warnings.push("⚠️ Secado lento - Cielo muy nublado (poca radiación solar)")
      } else {
        reasons.push("Cielo muy nublado")
      }
    }

    // Check humidity
    if (weather.main.humidity > 85) {
      if (canHang) {
        warnings.push("⚠️ No recomendado - Humedad muy alta")
      } else {
        reasons.push("Humedad muy alta")
      }
    }

    // Check wind
    if (weather.wind.speed > 6.94) {
      // 25 km/h is about 6.94 m/s
      if (canHang) {
        warnings.push("⚠️ Riesgoso - Viento fuerte")
      } else {
        reasons.push("Viento fuerte")
      }
    }

    // Check temperature
    if (weather.main.temp < 10) {
      if (canHang) {
        warnings.push("⚠️ Secado lento - Temperatura baja")
      } else {
        reasons.push("Temperatura baja")
      }
    }

    // Create detailed message for "No colgar" cases
    if (!canHang) {
      if (reasons.length === 1) {
        message = `No colgar - ${reasons[0]}`
      } else if (reasons.length > 1) {
        const mainReason = reasons[0]
        const otherReasons = reasons.slice(1).join(", ")
        message = `No colgar - ${mainReason} (además: ${otherReasons})`
      }
    }

    return {
      canHang,
      message,
      warnings,
      reasons,
    }
  }

  const decision = processWeatherDecision()

  // Format time from unix timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    return (
      <div className="relative">
        <img src={iconUrl || "/placeholder.svg"} alt={condition} width={100} height={100} className="mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <div className="text-center">
          {getWeatherIcon(weather.weather[0].main)}
          <div className="text-4xl font-bold mb-1">{Math.round(weather.main.temp)}°C</div>
          <p className="text-lg capitalize mb-2">{weather.weather[0].description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sensación térmica: {Math.round(weather.main.feels_like)}°C
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <div className="text-5xl mb-3">
              {decision.canHang && decision.warnings.length === 0 ? (
                <Check className="mx-auto text-green-500" size={56} />
              ) : decision.canHang ? (
                <AlertTriangle className="mx-auto text-yellow-500" size={56} />
              ) : (
                <X className="mx-auto text-red-500" size={56} />
              )}
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{decision.message}</p>
          </div>
        </div>

        {decision.warnings.length > 0 && (
          <div className="space-y-2 mb-4">
            {decision.warnings.map((warning, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm"
              >
                {warning}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
          <CardContent className="p-4 text-center">
            <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <div className="text-lg font-medium">{weather.main.humidity}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Humedad</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
          <CardContent className="p-4 text-center">
            <Wind className="h-6 w-6 mx-auto text-purple-500 mb-2" />
            <div className="text-lg font-medium">{Math.round(weather.wind.speed * 3.6)} km/h</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Viento</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-0">
          <CardContent className="p-4 text-center">
            <Thermometer className="h-6 w-6 mx-auto text-pink-500 mb-2" />
            <div className="text-lg font-medium">{Math.round(weather.main.feels_like)}°C</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Sensación</div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="ghost"
        onClick={() => toggleSection("details")}
        className="w-full flex justify-between items-center mb-2"
      >
        <span className="font-medium">Detalles adicionales</span>
        {expandedSection === "details" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          "grid grid-cols-2 gap-3 overflow-hidden transition-all duration-300",
          expandedSection === "details" ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0",
        )}
      >
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-0">
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 mx-auto text-gray-500 mb-2" />
            <div className="text-base font-medium">{(weather.visibility / 1000).toFixed(1)} km</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Visibilidad</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-0">
          <CardContent className="p-4 text-center">
            <Gauge className="h-5 w-5 mx-auto text-gray-500 mb-2" />
            <div className="text-base font-medium">{weather.main.pressure} hPa</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Presión</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-0">
          <CardContent className="p-4 text-center">
            <Sunrise className="h-5 w-5 mx-auto text-amber-500 mb-2" />
            <div className="text-base font-medium">{formatTime(weather.sys.sunrise)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Amanecer</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-0">
          <CardContent className="p-4 text-center">
            <Sunset className="h-5 w-5 mx-auto text-orange-500 mb-2" />
            <div className="text-base font-medium">{formatTime(weather.sys.sunset)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Atardecer</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Última actualización: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
