"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

interface City {
  name: string
  state: string
  country: string
  lat: number
  lon: number
  displayName: string
}

interface CitySearchProps {
  onCitySelect: (city: City) => void
  onSearch: (cityName: string) => void
  isLoading: boolean
  value: string
  onChange: (value: string) => void
}

export default function CitySearch({ onCitySelect, onSearch, isLoading, value, onChange }: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [citySelected, setCitySelected] = useState(false)
  const debouncedQuery = useDebounce(query, 500)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useOnClickOutside(containerRef, () => setShowSuggestions(false))

  // Update local state when prop value changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2 || citySelected) {
        setSuggestions([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/city-search?query=${encodeURIComponent(debouncedQuery)}&limit=5`)

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error fetching city suggestions:", error)
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery, citySelected])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onChange(value)
    setCitySelected(false) // Reset the selected state when user types

    if (value.trim().length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSelectCity = (city: City) => {
    setQuery(city.name)
    onChange(city.name)
    onCitySelect(city)
    setShowSuggestions(false)
    setCitySelected(true) // Mark that a city has been selected
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setShowSuggestions(false)
      setCitySelected(true) // Mark that a city has been selected (via search)
    }
  }

  const handleInputFocus = () => {
    // Only show suggestions on focus if user hasn't selected a city
    // and there's enough text to search
    if (!citySelected && query.trim().length >= 2) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Ingresa una ciudad..."
            className="w-full pr-8"
            required
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? "Buscando..." : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {suggestions.map((city, index) => (
              <li
                key={`${city.name}-${city.lat}-${city.lon}-${index}`}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-start"
                onClick={() => handleSelectCity(city)}
              >
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {city.state && `${city.state}, `}
                    {city.country}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
