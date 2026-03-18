import emailjs from "@emailjs/browser"

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export interface ExamAssignmentEmailParams {
  to_email: string
  exam_title: string
  start_time: string
  end_time: string
  duration_minutes: number
  total_questions: number
}

/**
 * Send exam assignment notification to a student.
 * Requires EmailJS to be configured (see .env.example).
 */
export async function sendExamAssignmentEmail(
  params: ExamAssignmentEmailParams
): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      "EmailJS not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY in .env"
    )
    return
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: params.to_email,
      exam_title: params.exam_title,
      start_time: params.start_time,
      end_time: params.end_time,
      duration_minutes: String(params.duration_minutes),
      total_questions: String(params.total_questions),
    },
    { publicKey: PUBLIC_KEY }
  )
}
