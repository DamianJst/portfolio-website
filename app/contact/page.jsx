import ContactForm from '@/components/ContactForm'
import styles from '@/styles/contact.module.scss'

export const metadata = {
  title: 'Contact - Front-End Developer',
  description: 'Get in touch to discuss your next project or collaboration.',
}

export default function ContactPage() {
  return (
    <main className={styles.contact}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Contact</h1>
        <ContactForm />
      </div>
    </main>
  )
}