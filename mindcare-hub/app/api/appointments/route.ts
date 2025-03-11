import { NextResponse } from "next/server"

// Mock database for appointments
const appointments = [
  {
    id: 1,
    userId: "user1@example.com",
    psychiatristId: 1,
    psychiatristName: "Dr. John Smith",
    date: "2025-03-20",
    time: "10:00",
    status: "confirmed",
    notes: "Initial consultation",
  },
  {
    id: 2,
    userId: "user2@example.com",
    psychiatristId: 3,
    psychiatristName: "Dr. Michael Chen",
    date: "2025-03-18",
    time: "14:00",
    status: "confirmed",
    notes: "Follow-up appointment",
  },
]

// GET - Retrieve appointments for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const userAppointments = appointments.filter((appointment) => appointment.userId === userId)

  return NextResponse.json(userAppointments)
}

// POST - Create a new appointment
export async function POST(request: Request) {
  try {
    const appointmentData = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "psychiatristId", "psychiatristName", "date", "time"]
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new appointment
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: "pending",
      notes: appointmentData.notes || "",
    }

    appointments.push(newAppointment)

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}

// PUT - Update an existing appointment
export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    const appointmentIndex = appointments.findIndex((a) => a.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updateData,
    }

    return NextResponse.json(appointments[appointmentIndex])
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

// DELETE - Cancel an appointment
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
  }

  const appointmentIndex = appointments.findIndex((a) => a.id === Number.parseInt(id))

  if (appointmentIndex === -1) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
  }

  // Remove the appointment
  const canceledAppointment = appointments[appointmentIndex]
  appointments.splice(appointmentIndex, 1)

  return NextResponse.json({
    message: "Appointment canceled successfully",
    appointment: canceledAppointment,
  })
}

