"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import WeatherDisplay from "@/components/weather-display"
import ForecastDisplay from "@/components/forecast-display"
import ApiKeyModal from "@/components/api-key-modal"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import GeolocationButton from "@/components/geolocation-button"
import CitySearch from "@/components/city-search"

interface City {
  name: string
  state: string
  country: string
  lat: number
  lon: number
  displayName: string
}

export default function Home() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const { toast } = useToast()

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity")
    const savedFavorites = localStorage.getItem("favoriteCities")

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error parsing favorites:", e)
      }
    }

    if (savedCity) {
      setCity(savedCity)
      fetchWeather(savedCity)
    }
  }, [])

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return

    setLoading(true)
    setError("")

    try {
      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      const weatherData = await weatherResponse.json()

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          setShowApiKeyModal(true)
        }
        throw new Error(weatherData.error || "Error al obtener datos del clima")
      }

      setWeather(weatherData)

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodeURIComponent(cityName)}`)
      const forecastData = await forecastResponse.json()

      if (!forecastResponse.ok) {
        throw new Error(forecastData.error || "Error al obtener pronóstico")
      }

      setForecast(forecastData)

      // Save to localStorage
      localStorage.setItem("lastCity", cityName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener datos del clima")
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat: number, lon: number, cityName: string) => {
    setLoading(true)
    setError("")
    setCity(cityName)

    try {
      // Fetch current weather by coordinates
      const weatherResponse = await fetch(`/api/weather-by-coords?lat=${lat}&lon=${lon}`)
      const weatherData = await weatherResponse.json()

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          setShowApiKeyModal(true)
        }
        throw new Error(weatherData.error || "Error al obtener datos del clima")
      }

      setWeather(weatherData)

      // Fetch forecast by coordinates
      const forecastResponse = await fetch(`/api/forecast-by-coords?lat=${lat}&lon=${lon}`)
      const forecastData = await forecastResponse.json()

      if (!forecastResponse.ok) {
        throw new Error(forecastData.error || "Error al obtener pronóstico")
      }

      setForecast(forecastData)

      // Save to localStorage
      localStorage.setItem("lastCity", cityName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener datos del clima")
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (selectedCity: City) => {
    setCity(selectedCity.name)
    fetchWeatherByCoords(selectedCity.lat, selectedCity.lon, selectedCity.name)
  }

  const toggleFavorite = (cityName: string) => {
    let newFavorites: string[]

    if (favorites.includes(cityName)) {
      newFavorites = favorites.filter((fav) => fav !== cityName)
      toast({
        title: "Ciudad eliminada",
        description: `${cityName} ha sido eliminada de favoritos`,
      })
    } else {
      newFavorites = [...favorites, cityName]
      toast({
        title: "Ciudad guardada",
        description: `${cityName} ha sido añadida a favoritos`,
      })
    }

    setFavorites(newFavorites)
    localStorage.setItem("favoriteCities", JSON.stringify(newFavorites))
  }

  const selectFavorite = (cityName: string) => {
    setCity(cityName)
    fetchWeather(cityName)
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const handleLocationFound = (lat: number, lon: number, cityName: string) => {
    fetchWeatherByCoords(lat, lon, cityName)
  }

  return (
    <main className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              ¿Tiende o no?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Descubre si es buen momento para colgar la ropa</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex gap-2 md:col-span-3">
            <CitySearch
              onCitySelect={handleCitySelect}
              onSearch={fetchWeather}
              isLoading={loading}
              value={city}
              onChange={setCity}
            />
            <GeolocationButton onLocationFound={handleLocationFound} isLoading={loading} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Favoritas</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <DropdownMenuItem key={fav} className="flex justify-between items-center">
                    <button onClick={() => selectFavorite(fav)} className="flex-grow text-left py-1">
                      {fav}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(fav)
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No hay ciudades favoritas</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {weather && (
          <Card className="mb-6 overflow-hidden border-0 shadow-lg dark:bg-gray-800">
            <CardContent className="p-0">
              <Tabs defaultValue="current">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="current">Clima Actual</TabsTrigger>
                  <TabsTrigger value="forecast">Pronóstico</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{city}</h2>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(city)} className="rounded-full">
                      <Star
                        className={`h-5 w-5 ${
                          favorites.includes(city) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>

                  <WeatherDisplay weather={weather} expandedSection={expandedSection} toggleSection={toggleSection} />
                </TabsContent>

                <TabsContent value="forecast" className="p-4">
                  {forecast ? (
                    <ForecastDisplay forecast={forecast} />
                  ) : (
                    <div className="text-center py-8">
                      <p>Cargando pronóstico...</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {!weather && !loading && !error && (
          <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg dark:border-gray-700">
            <div className="mb-4">
              <Star className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Ingresa una ciudad para ver si es buen momento para colgar la ropa
            </p>
          </div>
        )}
      </div>

      {showApiKeyModal && (
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onSave={(city) => {
            setShowApiKeyModal(false)
            if (city) {
              fetchWeather(city)
            }
          }}
        />
      )}

      <Toaster />
    </main>
  )
}
