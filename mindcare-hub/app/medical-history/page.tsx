"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Plus, ChevronDown, ChevronUp } from "lucide-react"
import styles from "./medical-history.module.css"

interface MedicalRecord {
  id: number
  date: string
  psychiatristName: string
  diagnosis: string
  notes: string
  medications: {
    name: string
    dosage: string
    frequency: string
  }[]
}

export default function MedicalHistory() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRecords, setExpandedRecords] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    // Load mock medical records
    fetchMedicalRecords()
  }, [router])

  const fetchMedicalRecords = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to fetch medical records
      // For demo purposes, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockRecords: MedicalRecord[] = [
        {
          id: 1,
          date: "2025-02-15",
          psychiatristName: "Dr. John Smith",
          diagnosis: "Generalized Anxiety Disorder (GAD)",
          notes:
            "Patient reports increased anxiety in social situations and difficulty sleeping. Recommended cognitive behavioral therapy (CBT) and mindfulness exercises.",
          medications: [
            { name: "Sertraline", dosage: "50mg", frequency: "Once daily" },
            { name: "Lorazepam", dosage: "0.5mg", frequency: "As needed for acute anxiety" },
          ],
        },
        {
          id: 2,
          date: "2025-01-10",
          psychiatristName: "Dr. John Smith",
          diagnosis: "Generalized Anxiety Disorder (GAD)",
          notes:
            "Initial consultation. Patient describes persistent worry and physical symptoms including muscle tension and fatigue. Discussed treatment options including medication and therapy.",
          medications: [{ name: "Sertraline", dosage: "25mg", frequency: "Once daily" }],
        },
      ]

      setRecords(mockRecords)
      // Expand the most recent record by default
      if (mockRecords.length > 0) {
        setExpandedRecords([mockRecords[0].id])
      }
    } catch (error) {
      console.error("Error fetching medical records:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRecordExpansion = (recordId: number) => {
    setExpandedRecords((prev) => (prev.includes(recordId) ? prev.filter((id) => id !== recordId) : [...prev, recordId]))
  }

  const isRecordExpanded = (recordId: number) => {
    return expandedRecords.includes(recordId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className={styles.loading}>Loading medical history...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Medical History</h1>
        <Button className={styles.addButton}>
          <Plus size={16} />
          Request Record Update
        </Button>
      </div>

      {records.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText size={48} className={styles.emptyIcon} />
          <h2>No Medical Records</h2>
          <p>You don't have any medical records yet. Records will appear here after your appointments.</p>
        </div>
      ) : (
        <div className={styles.recordsList}>
          {records.map((record) => (
            <div key={record.id} className={styles.recordCard}>
              <div className={styles.recordHeader} onClick={() => toggleRecordExpansion(record.id)}>
                <div className={styles.recordDate}>
                  <h3>{formatDate(record.date)}</h3>
                  <p>{record.psychiatristName}</p>
                </div>
                <div className={styles.recordDiagnosis}>
                  <span>{record.diagnosis}</span>
                </div>
                <Button variant="ghost" className={styles.expandButton}>
                  {isRecordExpanded(record.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </div>

              {isRecordExpanded(record.id) && (
                <div className={styles.recordDetails}>
                  <div className={styles.recordSection}>
                    <h4>Notes</h4>
                    <p>{record.notes}</p>
                  </div>

                  <div className={styles.recordSection}>
                    <h4>Medications</h4>
                    {record.medications.length > 0 ? (
                      <div className={styles.medicationsList}>
                        {record.medications.map((medication, index) => (
                          <div key={index} className={styles.medicationItem}>
                            <div className={styles.medicationName}>{medication.name}</div>
                            <div className={styles.medicationDetails}>
                              <span>{medication.dosage}</span>
                              <span className={styles.medicationFrequency}>{medication.frequency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No medications prescribed.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

