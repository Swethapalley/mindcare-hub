"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, AlertCircle } from "lucide-react"
import styles from "./ai-assessment.module.css"

export default function AIAssessment() {
  const [symptoms, setSymptoms] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [assessment, setAssessment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showRecommendation, setShowRecommendation] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setAssessment("")
    setShowRecommendation(false)

    try {
      const response = await fetch("/api/ai-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          duration,
          severity,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get assessment")
      }

      const data = await response.json()
      setAssessment(data.assessment)
      setShowRecommendation(data.recommendConsultation)
    } catch (err) {
      console.error("Error getting assessment:", err)
      setError("Failed to get assessment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>AI Mental Health Assessment</h1>
        <p>
          This tool uses AI to provide a preliminary assessment based on your symptoms.
          <strong> This is not a diagnosis</strong> and should not replace professional medical advice.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.assessmentForm}>
          <div className={styles.disclaimer}>
            <AlertCircle size={20} />
            <p>
              Your information is private and will only be used for this assessment. For accurate medical advice, please
              consult with a healthcare professional.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="symptoms">Describe your symptoms</label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe what you're experiencing (e.g., feeling sad, anxious, trouble sleeping, etc.)"
                required
                rows={5}
                className={styles.textArea}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration">How long have you been experiencing these symptoms?</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className={styles.select}
              >
                <option value="">Select duration</option>
                <option value="Less than a week">Less than a week</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="More than a year">More than a year</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="severity">How would you rate the severity of your symptoms?</label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                required
                className={styles.select}
              >
                <option value="">Select severity</option>
                <option value="Mild - Noticeable but not interfering with daily life">
                  Mild - Noticeable but not interfering with daily life
                </option>
                <option value="Moderate - Somewhat interfering with daily activities">
                  Moderate - Somewhat interfering with daily activities
                </option>
                <option value="Severe - Significantly impacting daily functioning">
                  Severe - Significantly impacting daily functioning
                </option>
                <option value="Very severe - Unable to perform normal daily activities">
                  Very severe - Unable to perform normal daily activities
                </option>
              </select>
            </div>

            <Button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Analyzing..." : "Get Assessment"}
            </Button>
          </form>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {assessment && (
          <div className={styles.assessmentResult}>
            <div className={styles.resultHeader}>
              <Brain size={24} />
              <h2>Assessment Results</h2>
            </div>
            <div className={styles.resultContent}>
              <p>{assessment}</p>
            </div>
            {showRecommendation && (
              <div className={styles.recommendation}>
                <h3>Next Steps</h3>
                <p>Based on your assessment, we recommend consulting with a mental health professional.</p>
                <Button className={styles.findButton} onClick={() => router.push("/find-psychiatrists")}>
                  Find Psychiatrists
                </Button>
              </div>
            )}
            <div className={styles.resultFooter}>
              <p>
                Remember: This is an AI-generated assessment and not a clinical diagnosis. For proper diagnosis and
                treatment, please consult with a healthcare professional.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

