'use client'

import { PageElement } from '@/components/transitions/LayoutTransition'
import styles from '@/styles/home.module.scss'

export default function Page() {
  return (
    <main className={styles.hero}>
      <div className={styles.content}>
        <PageElement 
          className={styles.heading} 
          exitOrder={0} // First element to exit
          entranceOrder={0} // First element to enter
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -30 }
          }}
        >
          <h1 className={styles.heading}>
            <span className={styles.line1}>GREAT EXPERIENCES ARE PRICELESS</span>
            <span className={styles.line2}>LET&apos;S CREATE THEM TOGETHER</span>
          </h1>
        </PageElement>

        <PageElement 
          exitOrder={1} // Second element to exit
          entranceOrder={1} // Second element to enter
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
          }}
        >
          <p className={styles.title}>FRONT-END DEVELOPER</p>
        </PageElement>
      </div>

      <PageElement 
        className={styles.scrollHint}
        exitOrder={2} // Last element to exit
        entranceOrder={2} // Last element to enter
        baseEntranceDelay={3} // Appears a bit later
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 0.8, y: 0 },
          exit: { opacity: 0, y: -10 }
        }}
      >
        <span>Scroll down</span>
      </PageElement>
    </main>
  )
}