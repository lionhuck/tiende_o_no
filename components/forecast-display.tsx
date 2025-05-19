import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Check, AlertTriangle, X, Sun, Moon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ForecastDisplayProps {
  forecast: any
}

export default function ForecastDisplay({ forecast }: ForecastDisplayProps) {
  // Process decision based on weather data
  const processWeatherDecision = (item: any) => {
    let canHang = true
    const warnings: string[] = []

    // Get time info
    const timestamp = item.dt * 1000
    const date = new Date(timestamp)
    const hour = date.getHours()

    // Ya no consideramos si es de noche como factor para la decisión
    // Mantenemos los iconos de sol/luna solo como referencia visual

    // Check for rain
    if (
      item.weather[0].main === "Rain" ||
      item.weather[0].main === "Drizzle" ||
      item.weather[0].main === "Thunderstorm"
    ) {
      canHang = false
      warnings.push("Lluvia")
    }

    // Check cloud coverage - affects solar radiation
    if (item.clouds && item.clouds.all > 80) {
      warnings.push("Muy nublado")
    }

    // Check humidity
    if (item.main.humidity > 85) {
      warnings.push("Humedad alta")
    }

    // Check wind
    if (item.wind.speed > 6.94) {
      warnings.push("Viento fuerte")
    }

    // Check temperature
    if (item.main.temp < 10) {
      warnings.push("Temperatura baja")
    }

    // If we have multiple warnings but can still hang, it's a conditional yes
    if (warnings.length > 0 && canHang) {
      canHang = true
    }

    return {
      canHang,
      warnings,
    }
  }

  // Format date from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return {
      hour: date.getHours().toString().padStart(2, "0"),
      day: date.getDate(),
      weekday: new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date),
      fullDate: date,
    }
  }

  // Group forecast by day - ensuring each day starts at 00:00 and ends at 21:00
  const groupByDay = () => {
    const grouped: Record<string, any[]> = {}
    const now = new Date()
    now.setMinutes(0, 0, 0) // Hoy a las 00:00

    // Filter out past hours (solo mostrar desde la hora actual en adelante)
    const filteredItems = forecast.list.filter((item: any) => {
      const itemDate = new Date(item.dt * 1000)
      return itemDate >= now
    })

  // Luego agrupamos por día local (no UTC)
  filteredItems.forEach((item: any) => {
    const itemDate = new Date(item.dt * 1000)
    // Usamos la fecha local para agrupar
    const dayKey = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}-${itemDate.getDate().toString().padStart(2, '0')}`
    
    if (!grouped[dayKey]) {
      grouped[dayKey] = []
    }
    grouped[dayKey].push(item)
  })

  // Ordenamos los días
  const sortedDays = Object.keys(grouped).sort()
  const result: Record<string, any[]> = {}

  sortedDays.forEach(day => {
    // Ordenamos las horas dentro de cada día
    grouped[day].sort((a, b) => a.dt - b.dt)
    result[day] = grouped[day]
  })

  return result
}

const groupedForecast = groupByDay()

  // Get day name - versión mejorada
  const getDayName = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "short"
      }).replace(/\./g, '')
    }
  }


  // Get time period icon (day/night)
  const getTimePeriodIcon = (hour: number) => {
    if (hour >= 7 && hour < 20) {
      return <Sun className="h-3 w-3 text-yellow-500" />
    } else {
      return <Moon className="h-3 w-3 text-blue-500" />
    }
  }

  // Format warnings for display
  const formatWarnings = (warnings: string[]) => {
    if (warnings.length === 0) return "Óptimo"

    // If there are multiple warnings, show the first one with a "+"
    if (warnings.length > 1) {
      return `${warnings[0]} +${warnings.length - 1}`
    }

    return warnings[0]
  }

  // Check if we have any forecast data after filtering
  const hasForecastData = Object.keys(groupedForecast).length > 0

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pronóstico por horas</h2>

      {hasForecastData ? (
        Object.entries(groupedForecast).map(([day, items], dayIndex) => (
          <div key={day} className="mb-6">
            <h3 className="text-md font-medium mb-3">{getDayName(day)}</h3>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-3">
                {items.map((item: any) => {
                  const time = formatTime(item.dt)
                  const decision = processWeatherDecision(item)

                  return (
                    <Card key={item.dt} className="min-w-[110px] border-0 shadow-md dark:bg-gray-800">
                      <CardContent className="p-3 text-center">
                        <div className="text-sm font-medium mb-1 flex items-center justify-center gap-1">
                          {getTimePeriodIcon(Number.parseInt(time.hour))}
                          {time.hour}:00
                        </div>

                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                          width={50}
                          height={50}
                          className="mx-auto"
                        />

                        <div className="text-lg font-bold mb-1">{Math.round(item.main.temp)}°C</div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 h-8">
                          {item.weather[0].description}
                        </div>

                        <div className="h-6">
                          {decision.canHang ? (
                            decision.warnings.length > 0 ? (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span className="text-xs">{formatWarnings(decision.warnings)}</span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                <span className="text-xs">Óptimo</span>
                              </Badge>
                            )
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                            >
                              <X className="h-3 w-3 mr-1" />
                              <span className="text-xs">{formatWarnings(decision.warnings)}</span>
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay datos de pronóstico disponibles para los próximos días.
        </div>
      )}
    </div>
  )
}
