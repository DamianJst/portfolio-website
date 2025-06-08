// app/page.jsx
import styles from '@/styles/home.module.scss'

export default function Page() {
  // Pure server component - no 3D imports needed
  return (
    <>
      <main className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.line1}>GREAT EXPERIENCES ARE PRICELESS</span>
            <span className={styles.line2}>LET&apos;S CREATE THEM TOGETHER</span>
          </h1>
          <p className={styles.title}>FRONT-END DEVELOPER</p>
        </div>

        <div className={styles.scrollHint}>
          <span>Scroll down</span>
        </div>
      </main>
    </>
  )
}
