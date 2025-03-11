import { NextResponse } from "next/server"

// Mock data for psychiatrists
const psychiatrists = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Depression, Anxiety",
    location: "New York, NY",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 40.7128, lng: -74.006 },
    availability: [
      { date: "2025-03-15", slots: ["09:00", "10:00", "14:00"] },
      { date: "2025-03-16", slots: ["11:00", "13:00", "15:00"] },
    ],
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    specialty: "PTSD, Trauma",
    location: "Boston, MA",
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 42.3601, lng: -71.0589 },
    availability: [
      { date: "2025-03-15", slots: ["10:00", "11:00", "16:00"] },
      { date: "2025-03-16", slots: ["09:00", "14:00", "17:00"] },
    ],
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    specialty: "Bipolar Disorder, Schizophrenia",
    location: "San Francisco, CA",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    availability: [
      { date: "2025-03-15", slots: ["08:00", "13:00", "17:00"] },
      { date: "2025-03-16", slots: ["09:00", "12:00", "15:00"] },
    ],
  },
  {
    id: 4,
    name: "Dr. Emily Rodriguez",
    specialty: "Eating Disorders, Anxiety",
    location: "Miami, FL",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    availability: [
      { date: "2025-03-15", slots: ["11:00", "14:00", "16:00"] },
      { date: "2025-03-16", slots: ["10:00", "13:00", "15:00"] },
    ],
  },
  {
    id: 5,
    name: "Dr. David Wilson",
    specialty: "Addiction, Depression",
    location: "Chicago, IL",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    availability: [
      { date: "2025-03-15", slots: ["09:00", "12:00", "15:00"] },
      { date: "2025-03-16", slots: ["10:00", "14:00", "16:00"] },
    ],
  },
  {
    id: 6,
    name: "Dr. Lisa Park",
    specialty: "Child Psychology, ADHD",
    location: "Seattle, WA",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    availability: [
      { date: "2025-03-15", slots: ["10:00", "13:00", "16:00"] },
      { date: "2025-03-16", slots: ["09:00", "11:00", "15:00"] },
    ],
  },
]

export async function GET(request: Request) {
  // Get search parameters from URL
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.toLowerCase()
  const city = searchParams.get("city")?.toLowerCase()
  const specialty = searchParams.get("specialty")?.toLowerCase()

  let filteredPsychiatrists = [...psychiatrists]

  // Filter by search query
  if (query) {
    filteredPsychiatrists = filteredPsychiatrists.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.specialty.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query),
    )
  }

  // Filter by city
  if (city) {
    filteredPsychiatrists = filteredPsychiatrists.filter((p) => p.location.toLowerCase().includes(city))
  }

  // Filter by specialty
  if (specialty) {
    filteredPsychiatrists = filteredPsychiatrists.filter((p) => p.specialty.toLowerCase().includes(specialty))
  }

  // Simulate a slight delay to mimic a real API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(filteredPsychiatrists)
}

