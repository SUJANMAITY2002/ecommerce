// import { useState, useRef, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { showNotification } from '../components/Notification'
// import './auth-shared.css'

// const validateEmail = (v) => {
//   if (!v) return 'Email is required'
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
//   return ''
// }

// const getStrength = (pwd) => {
//   if (!pwd) return 0
//   let s = 0
//   if (pwd.length >= 6) s++
//   if (pwd.length >= 10) s++
//   if (/[A-Z]/.test(pwd)) s++
//   if (/[^A-Za-z0-9]/.test(pwd)) s++
//   return Math.min(s, 4)
// }
// const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
// const strengthColor = ['', '#f87171', '#fb923c', '#facc15', '#4ade80']

// /* Fake API helpers — replace with real fetch calls */
// const fakeRequestReset = () =>
//   new Promise((r) => setTimeout(() => r({ success: true, otp: '654321' }), 1400))

// export default function ForgotPassword() {
//   const navigate = useNavigate()
//   const otpRefs  = useRef([])

//   /* steps: 'email' | 'otp' | 'reset' | 'done' */
//   const [step, setStep]       = useState('email')
//   const [email, setEmail]     = useState('')
//   const [emailErr, setEmailErr] = useState('')
//   const [emailTouched, setEmailTouched] = useState(false)

//   const [sending, setSending] = useState(false)
//   const [countdown, setCountdown] = useState(0)
//   const [devOtp, setDevOtp]   = useState('')

//   const [otp, setOtp]         = useState(['','','','','',''])
//   const [otpErr, setOtpErr]   = useState('')
//   const [verifying, setVerifying] = useState(false)

//   const [newPwd, setNewPwd]   = useState('')
//   const [confirmPwd, setConfirmPwd] = useState('')
//   const [showPwd, setShowPwd] = useState(false)
//   const [pwdErrs, setPwdErrs] = useState({})
//   const [resetting, setResetting] = useState(false)

//   useEffect(() => {
//     if (countdown <= 0) return
//     const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
//     return () => clearTimeout(t)
//   }, [countdown])

//   /* ── Step 1: request OTP ── */
//   const requestOtp = async () => {
//     setEmailTouched(true)
//     const err = validateEmail(email)
//     setEmailErr(err)
//     if (err) return
//     setSending(true)
//     try {
//       const res = await fakeRequestReset()
//       if (res.success) {
//         setDevOtp(res.otp)
//         setStep('otp')
//         setCountdown(60)
//         showNotification('OTP sent to your email!', 'success')
//       }
//     } catch { showNotification('Failed to send OTP', 'error') }
//     finally { setSending(false) }
//   }

//   /* ── OTP handlers ── */
//   const handleOtpChange = (i, val) => {
//     if (!/^\d?$/.test(val)) return
//     const next = [...otp]; next[i] = val; setOtp(next)
//     setOtpErr('')
//     if (val && i < 5) otpRefs.current[i + 1]?.focus()
//   }
//   const handleOtpKey = (i, e) => {
//     if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
//   }
//   const handleOtpPaste = (e) => {
//     const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
//     if (p.length === 6) { setOtp(p.split('')); otpRefs.current[5]?.focus() }
//     e.preventDefault()
//   }

//   /* ── Step 2: verify OTP ── */
//   const verifyOtp = async () => {
//     const entered = otp.join('')
//     if (entered.length < 6) { setOtpErr('Enter all 6 digits'); return }
//     setVerifying(true)
//     await new Promise(r => setTimeout(r, 800))
//     if (entered === devOtp) {
//       setStep('reset')
//       showNotification('OTP verified! Set your new password.', 'success')
//     } else {
//       setOtpErr('Incorrect OTP. Please try again.')
//     }
//     setVerifying(false)
//   }

//   /* ── Step 3: reset password ── */
//   const resetPassword = async () => {
//     const errs = {}
//     if (!newPwd) errs.newPwd = 'New password is required'
//     else if (newPwd.length < 6) errs.newPwd = 'At least 6 characters'
//     if (!confirmPwd) errs.confirmPwd = 'Please confirm password'
//     else if (newPwd !== confirmPwd) errs.confirmPwd = 'Passwords do not match'
//     setPwdErrs(errs)
//     if (Object.keys(errs).length) return

//     setResetting(true)
//     try {
//       /* Replace with real API: POST /api/auth/reset-password */
//       await new Promise(r => setTimeout(r, 1200))
//       setStep('done')
//       showNotification('Password reset successfully! 🎉', 'success')
//     } catch { showNotification('Reset failed. Please try again.', 'error') }
//     finally { setResetting(false) }
//   }

//   const strength = getStrength(newPwd)

//   return (
//     <div className="auth-root">
//       <div className="auth-bg">
//         <div className="auth-bg__orb auth-bg__orb--1" />
//         <div className="auth-bg__orb auth-bg__orb--2" />
//         <div className="auth-bg__orb auth-bg__orb--3" />
//         <div className="auth-bg__grid" />
//       </div>

//       <div className="auth-card">
//         {/* Brand */}
//         <div className="auth-brand">
//           <div className="auth-brand__icon">
//             <svg viewBox="0 0 40 40" fill="none">
//               <rect width="40" height="40" rx="12" fill="url(#fpGrad)" />
//               <path d="M10 28L20 12L30 28H24L20 21L16 28H10Z" fill="white" fillOpacity="0.9" />
//               <defs>
//                 <linearGradient id="fpGrad" x1="0" y1="0" x2="40" y2="40">
//                   <stop stopColor="#9f67f5"/><stop offset="1" stopColor="#6366f1"/>
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//           <span className="auth-brand__name">Sujan Store</span>
//         </div>

//         {/* Progress indicator */}
//         <div className="fp-steps">
//           {['email','otp','reset'].map((s, i) => (
//             <div key={s} className={`fp-step ${step === s ? 'fp-step--active' : ''} ${['otp','reset','done'].indexOf(step) > i - 1 && step !== s ? 'fp-step--done' : ''}`}>
//               <div className="fp-step__dot">{['otp','reset','done'].indexOf(step) > i - 1 && step !== s ? '✓' : i + 1}</div>
//               <span className="fp-step__label">{['Email','Verify','Reset'][i]}</span>
//             </div>
//           ))}
//         </div>

//         {/* ── Step: Email ── */}
//         {step === 'email' && (
//           <>
//             <h1 className="auth-title">Forgot password?</h1>
//             <p className="auth-subtitle">Enter your email and we'll send you a reset code</p>

//             <div className={`auth-field auth-field--${emailTouched && emailErr ? 'error' : emailTouched && !emailErr && email ? 'success' : 'idle'}`}>
//               <label htmlFor="fp-email" className="auth-label">Email Address</label>
//               <div className="auth-input-wrap">
//                 <span className="auth-input-icon">
//                   <svg viewBox="0 0 20 20" fill="none"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                 </span>
//                 <input id="fp-email" type="email" autoComplete="email"
//                   placeholder="you@example.com" value={email}
//                   onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailErr(validateEmail(e.target.value)) }}
//                   onBlur={() => { setEmailTouched(true); setEmailErr(validateEmail(email)) }}
//                   onKeyDown={(e) => e.key === 'Enter' && requestOtp()}
//                   className="auth-input" />
//               </div>
//               {emailTouched && emailErr && <p className="auth-error">{emailErr}</p>}
//             </div>

//             <button onClick={requestOtp} disabled={sending} className="auth-submit">
//               {sending ? <span className="auth-dots"><span/><span/><span/></span> : <>Send Reset Code <span className="auth-submit-arrow">→</span></>}
//             </button>
//             <div className="auth-divider"><span>remembered it?</span></div>
//             <p className="auth-switch"><Link to="/signin" className="auth-switch-link">← Back to Sign In</Link></p>
//           </>
//         )}

//         {/* ── Step: OTP ── */}
//         {step === 'otp' && (
//           <>
//             <h1 className="auth-title">Check your email</h1>
//             <p className="auth-subtitle">
//               We sent a 6-digit code to <strong style={{color:'rgba(192,132,252,0.9)'}}>{email}</strong>
//             </p>
//             {devOtp && <p className="otp-dev-hint">🔧 Dev OTP: <strong>{devOtp}</strong></p>}

//             <div className="otp-boxes-standalone" onPaste={handleOtpPaste}>
//               {otp.map((d, i) => (
//                 <input key={i} ref={el => otpRefs.current[i] = el}
//                   type="text" inputMode="numeric" maxLength={1} value={d}
//                   onChange={(e) => handleOtpChange(i, e.target.value)}
//                   onKeyDown={(e) => handleOtpKey(i, e)}
//                   className={`otp-box${d ? ' otp-box--filled' : ''}${otpErr ? ' otp-box--error' : ''}`} />
//               ))}
//             </div>
//             {otpErr && <p className="auth-error otp-err-center">{otpErr}</p>}

//             <button onClick={verifyOtp} disabled={verifying || otp.join('').length < 6} className="auth-submit">
//               {verifying ? <span className="auth-dots"><span/><span/><span/></span> : 'Verify Code'}
//             </button>

//             <div className="otp-resend-row">
//               {countdown > 0
//                 ? <span className="otp-timer">Resend in <strong>{countdown}s</strong></span>
//                 : <button onClick={requestOtp} disabled={sending} className="otp-resend-link">
//                     {sending ? 'Sending…' : 'Resend code'}
//                   </button>
//               }
//               <button onClick={() => setStep('email')} className="otp-back-link">Change email</button>
//             </div>
//           </>
//         )}

//         {/* ── Step: Reset ── */}
//         {step === 'reset' && (
//           <>
//             <h1 className="auth-title">Set new password</h1>
//             <p className="auth-subtitle">Choose a strong password for your account</p>

//             {/* New password */}
//             <div className={`auth-field auth-field--${pwdErrs.newPwd ? 'error' : newPwd && !pwdErrs.newPwd ? 'success' : 'idle'}`}>
//               <label htmlFor="fp-new" className="auth-label">New Password</label>
//               <div className="auth-input-wrap">
//                 <span className="auth-input-icon"><svg viewBox="0 0 20 20" fill="none"><rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
//                 <input id="fp-new" type={showPwd ? 'text' : 'password'} placeholder="Min 6 characters"
//                   value={newPwd} onChange={(e) => { setNewPwd(e.target.value); if (pwdErrs.newPwd) setPwdErrs(p => ({...p, newPwd: ''})) }}
//                   className="auth-input" />
//                 <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(s => !s)}>
//                   {showPwd ? <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                     : <svg viewBox="0 0 20 20" fill="none"><path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>}
//                 </button>
//               </div>
//               {newPwd && (
//                 <div className="pwd-strength">
//                   <div className="pwd-bars">
//                     {[1,2,3,4].map(n => <div key={n} className="pwd-bar" style={{background: strength >= n ? strengthColor[strength] : 'rgba(255,255,255,0.08)'}} />)}
//                   </div>
//                   <span className="pwd-label" style={{color: strengthColor[strength]}}>{strengthLabel[strength]}</span>
//                 </div>
//               )}
//               {pwdErrs.newPwd && <p className="auth-error">{pwdErrs.newPwd}</p>}
//             </div>

//             {/* Confirm password */}
//             <div className={`auth-field auth-field--${pwdErrs.confirmPwd ? 'error' : confirmPwd && confirmPwd === newPwd ? 'success' : 'idle'}`}>
//               <label htmlFor="fp-confirm" className="auth-label">Confirm Password</label>
//               <div className="auth-input-wrap">
//                 <span className="auth-input-icon"><svg viewBox="0 0 20 20" fill="none"><rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
//                 <input id="fp-confirm" type="password" placeholder="Repeat password"
//                   value={confirmPwd} onChange={(e) => { setConfirmPwd(e.target.value); if (pwdErrs.confirmPwd) setPwdErrs(p => ({...p, confirmPwd: ''})) }}
//                   className="auth-input" />
//                 {confirmPwd && confirmPwd === newPwd && (
//                   <span className="auth-input-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
//                 )}
//               </div>
//               {pwdErrs.confirmPwd && <p className="auth-error">{pwdErrs.confirmPwd}</p>}
//             </div>

//             <button onClick={resetPassword} disabled={resetting} className="auth-submit">
//               {resetting ? <span className="auth-dots"><span/><span/><span/></span> : 'Reset Password'}
//             </button>
//           </>
//         )}

//         {/* ── Step: Done ── */}
//         {step === 'done' && (
//           <div className="fp-done">
//             <div className="fp-done__icon">
//               <svg viewBox="0 0 48 48" fill="none">
//                 <circle cx="24" cy="24" r="23" stroke="url(#doneGrad)" strokeWidth="2"/>
//                 <path d="M14 24l8 8 12-14" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 <defs><linearGradient id="doneGrad" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#4ade80"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
//               </svg>
//             </div>
//             <h1 className="auth-title fp-done__title">Password reset!</h1>
//             <p className="auth-subtitle">Your password has been updated successfully. You can now sign in with your new password.</p>
//             <button onClick={() => navigate('/signin')} className="auth-submit">
//               Go to Sign In <span className="auth-submit-arrow">→</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }