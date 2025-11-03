import { redirect } from 'next/navigation'

export default function BlogPost() {
  // Por defecto, redirigir a la versión en español
  redirect('/blog/dead-internet-theory/es')
}

