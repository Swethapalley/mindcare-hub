"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Calendar, MessageSquare, FileText, Map, User } from "lucide-react"
import styles from "./dashboard.module.css"

interface UserData {
  email: string
  firstName?: string
  lastName?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error("Failed to parse user data", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>MindCare Hub</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#" className={`${styles.sidebarLink} ${styles.active}`}>
            <User size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Search size={20} />
            <span>Find Psychiatrists</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Calendar size={20} />
            <span>Appointments</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            <MessageSquare size={20} />
            <span>Chat</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            <FileText size={20} />
            <span>Medical History</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Map size={20} />
            <span>Nearby Psychiatrists</span>
          </a>
        </nav>
        <div className={styles.sidebarFooter}>
          <Button variant="outline" className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search psychiatrists by name, specialty, or location..."
              className={styles.searchInput}
            />
            <Button className={styles.searchButton}>
              <Search size={18} />
              <span>Search</span>
            </Button>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user?.firstName?.charAt(0) || user?.email.charAt(0).toUpperCase()}</div>
            <div className={styles.userName}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.email}
            </div>
          </div>
        </header>

        <div className={styles.dashboardContent}>
          <h1>Welcome, {user?.firstName || "User"}!</h1>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Upcoming Appointments</h3>
              <div className={styles.statValue}>0</div>
            </div>
            <div className={styles.statCard}>
              <h3>Unread Messages</h3>
              <div className={styles.statValue}>0</div>
            </div>
            <div className={styles.statCard}>
              <h3>Psychiatrists Near You</h3>
              <div className={styles.statValue}>12</div>
            </div>
          </div>

          <section className={styles.psychiatristsSection}>
            <div className={styles.sectionHeader}>
              <h2>Recommended Psychiatrists</h2>
              <Button variant="outline" className={styles.viewAllButton}>
                View All
              </Button>
            </div>

            <div className={styles.psychiatristsGrid}>
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className={styles.psychiatristCard}>
                  <div className={styles.psychiatristAvatar}>
                    <img src={`/placeholder.svg?height=100&width=100`} alt="Psychiatrist" />
                  </div>
                  <div className={styles.psychiatristInfo}>
                    <h3>Dr. John Doe</h3>
                    <p className={styles.specialty}>Depression, Anxiety</p>
                    <p className={styles.location}>New York, NY</p>
                    <div className={styles.rating}>
                      ★★★★☆ <span>(4.2)</span>
                    </div>
                    <Button className={styles.bookButton}>Book Appointment</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.aiSection}>
            <div className={styles.sectionHeader}>
              <h2>AI Disorder Detection</h2>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiContent}>
                <p>
                  Our AI-powered tool can help identify potential mental health concerns based on your symptoms and
                  behaviors.
                </p>
                <p>Take a quick assessment to get insights about your mental wellbeing.</p>
                <Button className={styles.aiButton}>Start Assessment</Button>
              </div>
              <div className={styles.aiImage}>
                <img src="/placeholder.svg?height=200&width=200" alt="AI Assessment" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

