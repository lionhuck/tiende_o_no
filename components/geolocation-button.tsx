"use client"

import { useState } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface GeolocationButtonProps {
  onLocationFound: (lat: number, lon: number, cityName: string) => void
  isLoading: boolean
}

export default function GeolocationButton({ onLocationFound, isLoading }: GeolocationButtonProps) {
  const [geoLoading, setGeoLoading] = useState(false)
  const { toast } = useToast()

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "La geolocalización no está disponible en tu navegador",
        variant: "destructive",
      })
      return
    }

    setGeoLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Use server endpoint for reverse geocoding instead of direct API call
          const response = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)

          if (!response.ok) {
            throw new Error("No se pudo obtener el nombre de la ciudad")
          }

          const data = await response.json()
          const cityName = data.cityName || "Tu ubicación"

          onLocationFound(latitude, longitude, cityName)

          toast({
            title: "Ubicación detectada",
            description: `Se ha detectado tu ubicación: ${cityName}`,
          })
        } catch (error) {
          console.error("Error getting location:", error)
          toast({
            title: "Error",
            description: "No se pudo obtener tu ubicación",
            variant: "destructive",
          })
        } finally {
          setGeoLoading(false)
        }
      },
      (error) => {
        setGeoLoading(false)

        let errorMessage = "No se pudo obtener tu ubicación"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Habilita el acceso a la ubicación en tu navegador."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "La información de ubicación no está disponible."
            break
          case error.TIMEOUT:
            errorMessage = "Se agotó el tiempo para obtener tu ubicación."
            break
        }

        toast({
          title: "Error de geolocalización",
          description: errorMessage,
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleGetLocation}
      disabled={geoLoading || isLoading}
      className="rounded-full"
      title="Usar mi ubicación actual"
    >
      {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
    </Button>
  )
}
