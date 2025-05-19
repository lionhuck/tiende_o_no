"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (city?: string) => void
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una API key",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/set-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar la API key")
      }

      toast({
        title: "API key guardada",
        description: "La API key ha sido configurada correctamente",
      })

      onSave(city.trim() || undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar la API key",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar API Key</DialogTitle>
          <DialogDescription>
            Ingresa tu API key de OpenWeatherMap para continuar usando la aplicación.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ingresa tu API key de OpenWeatherMap"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Ciudad (opcional)</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ciudad a consultar después de guardar"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Para obtener una API key:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Regístrate en{" "}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OpenWeatherMap
                </a>
              </li>
              <li>Genera una API key gratuita</li>
              <li>Copia y pega la API key en este campo</li>
            </ol>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
