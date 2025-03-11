import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>MindCare Hub</h1>
        </div>
        <nav className={styles.nav}>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/services" className={styles.navLink}>
            Services
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
          <Link href="/login">
            <Button className={styles.loginButton}>Login</Button>
          </Link>
          <Link href="/register">
            <Button className={styles.registerButton} variant="outline">
              Register
            </Button>
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h2>Your Mental Health Matters</h2>
            <p>
              Connect with professional psychiatrists, track your progress, and take control of your mental wellbeing.
            </p>
            <Link href="/register">
              <Button className={styles.ctaButton}>
                Get Started <ArrowRight className={styles.arrowIcon} size={16} />
              </Button>
            </Link>
          </div>
          <div className={styles.heroImage}>
            <img src="/placeholder.svg?height=400&width=500" alt="Mental health illustration" />
          </div>
        </section>

        <section className={styles.features}>
          <h2>Our Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Find Psychiatrists</h3>
              <p>Search for psychiatrists in your city and view their profiles.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Book Appointments</h3>
              <p>Schedule appointments with psychiatrists at your convenience.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>AI Disorder Detection</h3>
              <p>Get preliminary assessments using our AI-powered tools.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Real-time Chat</h3>
              <p>Communicate with your psychiatrist through secure messaging.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Medical History</h3>
              <p>Keep track of your medical history and progress.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Nearby Locations</h3>
              <p>Find psychiatrists near you with our map integration.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 MindCare Hub. All rights reserved.</p>
      </footer>
    </div>
  )
}

