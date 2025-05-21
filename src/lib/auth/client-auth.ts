import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user
    
    const { saveUserOnServer } = await import('./saveUser')

    await saveUserOnServer({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
    })
    
    const { createSessionCookie } = await import('./auth')
    await createSessionCookie({ uid: firebaseUser.uid })

    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    }
  } catch (error) {
    console.error('Erro ao redirecionar para autenticação Google:', error)
    throw error
  }
}
