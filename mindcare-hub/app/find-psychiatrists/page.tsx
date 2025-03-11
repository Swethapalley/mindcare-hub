"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Filter } from "lucide-react"
import styles from "./find-psychiatrists.module.css"

interface Psychiatrist {
  id: number
  name: string
  specialty: string
  location: string
  rating: number
  image: string
  coordinates: {
    lat: number
    lng: number
  }
  availability: {
    date: string
    slots: string[]
  }[]
}

export default function FindPsychiatrists() {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    // Fetch psychiatrists
    fetchPsychiatrists()
  }, [router])

  const fetchPsychiatrists = async (query = "", city = "", specialty = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (city) params.append("city", city)
      if (specialty) params.append("specialty", specialty)

      const response = await fetch(`/api/psychiatrists?${params.toString()}`)
      const data = await response.json()
      setPsychiatrists(data)
    } catch (error) {
      console.error("Error fetching psychiatrists:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPsychiatrists(searchQuery, cityFilter, specialtyFilter)
  }

  const handleBookAppointment = (psychiatristId: number) => {
    router.push(`/book-appointment/${psychiatristId}`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Find Psychiatrists</h1>
        <p>Search for psychiatrists by name, specialty, or location</p>
      </header>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.searchInputContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search psychiatrists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button onClick={handleSearch} className={styles.searchButton}>
            Search
          </Button>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <MapPin size={16} />
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={styles.filterSelect}>
              <option value="">All Locations</option>
              <option value="new york">New York</option>
              <option value="boston">Boston</option>
              <option value="san francisco">San Francisco</option>
              <option value="miami">Miami</option>
              <option value="chicago">Chicago</option>
              <option value="seattle">Seattle</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Specialties</option>
              <option value="depression">Depression</option>
              <option value="anxiety">Anxiety</option>
              <option value="ptsd">PTSD</option>
              <option value="bipolar">Bipolar Disorder</option>
              <option value="eating">Eating Disorders</option>
              <option value="addiction">Addiction</option>
              <option value="child">Child Psychology</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          <p>Google Maps integration will be displayed here</p>
          <p>Shows psychiatrists' locations based on search criteria</p>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <h2>
          {loading
            ? "Loading psychiatrists..."
            : psychiatrists.length === 0
              ? "No psychiatrists found"
              : `Found ${psychiatrists.length} psychiatrists`}
        </h2>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.psychiatristsList}>
            {psychiatrists.map((psychiatrist) => (
              <div key={psychiatrist.id} className={styles.psychiatristCard}>
                <div className={styles.psychiatristImage}>
                  <img src={psychiatrist.image || "/placeholder.svg"} alt={psychiatrist.name} />
                </div>
                <div className={styles.psychiatristInfo}>
                  <h3>{psychiatrist.name}</h3>
                  <p className={styles.specialty}>{psychiatrist.specialty}</p>
                  <p className={styles.location}>
                    <MapPin size={16} />
                    {psychiatrist.location}
                  </p>
                  <div className={styles.rating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.floor(psychiatrist.rating) ? styles.starFilled : styles.star}>
                        ★
                      </span>
                    ))}
                    <span className={styles.ratingValue}>({psychiatrist.rating})</span>
                  </div>
                  <Button className={styles.bookButton} onClick={() => handleBookAppointment(psychiatrist.id)}>
                    Book Appointment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

