import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier, signOut as fbSignOut } from 'firebase/auth'
import { auth } from './client'

const gProvider = new GoogleAuthProvider()
let _recaptcha: RecaptchaVerifier | null = null

export async function emailSignIn(email: string, pw: string) { return signInWithEmailAndPassword(auth, email, pw) }
export async function emailSignUp(email: string, pw: string) { const uc = await createUserWithEmailAndPassword(auth, email, pw); await sendEmailVerification(uc.user); return uc }
export async function googleSignIn() { return signInWithPopup(auth, gProvider) }
export function initRecaptcha(containerId: string) { if (!_recaptcha) { _recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' }) } return _recaptcha }
export async function sendOTP(phone: string) { const v = initRecaptcha('recaptcha-container'); const r = await signInWithPhoneNumber(auth, phone, v); (window as any)._confirmResult = r; return r }
export async function verifyOTP(code: string) { const c = (window as any)._confirmResult; if (!c) throw new Error('No OTP session'); return c.confirm(code) }
export async function signOut() { return fbSignOut(auth) }
