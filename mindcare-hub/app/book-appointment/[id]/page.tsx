"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft } from "lucide-react"
import styles from "./book-appointment.module.css"

interface Psychiatrist {
  id: number
  name: string
  specialty: string
  location: string
  rating: number
  image: string
  availability: {
    date: string
    slots: string[]
  }[]
}

export default function BookAppointment({ params }: { params: { id: string } }) {
  const [psychiatrist, setPsychiatrist] = useState<Psychiatrist | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    // Fetch psychiatrist details
    fetchPsychiatristDetails()
  }, [params.id, router])

  const fetchPsychiatristDetails = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to fetch a specific psychiatrist
      const response = await fetch(`/api/psychiatrists?query=${params.id}`)
      const data = await response.json()

      if (data.length > 0) {
        setPsychiatrist(data[0])
        // Set the first available date as selected by default
        if (data[0].availability && data[0].availability.length > 0) {
          setSelectedDate(data[0].availability[0].date)
        }
      }
    } catch (error) {
      console.error("Error fetching psychiatrist details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time for your appointment")
      return
    }

    setBookingStatus("loading")

    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userData)

      // In a real app, this would be an API call to book the appointment
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.email,
          psychiatristId: psychiatrist?.id,
          psychiatristName: psychiatrist?.name,
          date: selectedDate,
          time: selectedTime,
          notes: notes,
        }),
      })

      if (response.ok) {
        setBookingStatus("success")
        // Redirect to appointments page after a delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setBookingStatus("error")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      setBookingStatus("error")
    }
  }

  const getAvailableTimesForDate = (date: string) => {
    if (!psychiatrist || !psychiatrist.availability) return []

    const dateAvailability = psychiatrist.availability.find((a) => a.date === date)
    return dateAvailability ? dateAvailability.slots : []
  }

  if (loading) {
    return <div className={styles.loading}>Loading psychiatrist details...</div>
  }

  if (!psychiatrist) {
    return <div className={styles.error}>Psychiatrist not found</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" className={styles.backButton} onClick={() => router.back()}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <h1>Book an Appointment</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.psychiatristInfo}>
          <div className={styles.psychiatristImage}>
            <img src={psychiatrist.image || "/placeholder.svg"} alt={psychiatrist.name} />
          </div>
          <div className={styles.psychiatristDetails}>
            <h2>{psychiatrist.name}</h2>
            <p className={styles.specialty}>{psychiatrist.specialty}</p>
            <p className={styles.location}>{psychiatrist.location}</p>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(psychiatrist.rating) ? styles.starFilled : styles.star}>
                  ★
                </span>
              ))}
              <span className={styles.ratingValue}>({psychiatrist.rating})</span>
            </div>
          </div>
        </div>

        <div className={styles.bookingSection}>
          <div className={styles.dateSelection}>
            <h3>
              <Calendar size={18} />
              Select Date
            </h3>
            <div className={styles.dateGrid}>
              {psychiatrist.availability.map((avail) => (
                <Button
                  key={avail.date}
                  variant={selectedDate === avail.date ? "default" : "outline"}
                  className={styles.dateButton}
                  onClick={() => {
                    setSelectedDate(avail.date)
                    setSelectedTime(null)
                  }}
                >
                  {new Date(avail.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className={styles.timeSelection}>
              <h3>
                <Clock size={18} />
                Select Time
              </h3>
              <div className={styles.timeGrid}>
                {getAvailableTimesForDate(selectedDate).map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={styles.timeButton}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.notesSection}>
            <h3>Additional Notes (Optional)</h3>
            <textarea
              className={styles.notesInput}
              placeholder="Add any notes or specific concerns you'd like to discuss during your appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.bookingActions}>
            {bookingStatus === "success" ? (
              <div className={styles.successMessage}>Appointment booked successfully! Redirecting to dashboard...</div>
            ) : (
              <Button
                className={styles.bookButton}
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || bookingStatus === "loading"}
              >
                {bookingStatus === "loading" ? "Booking..." : "Confirm Appointment"}
              </Button>
            )}

            {bookingStatus === "error" && (
              <div className={styles.errorMessage}>There was an error booking your appointment. Please try again.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

