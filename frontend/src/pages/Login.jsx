import { useState } from 'react'
import { signIn, signUp, confirmSignUp, signInWithRedirect } from 'aws-amplify/auth'

function Login({ onAuthSuccess }) {
  const [mode, setMode] = useState('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('buyer')
  const [confirmCode, setConfirmCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    setError('')
    try {
      await signIn({ username: email, password })
      onAuthSuccess()
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    setLoading(true)
    setError('')
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:full_name': fullName,
            'custom:role': role
          }
        }
      })
      setMode('confirm')
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    setLoading(true)
    setError('')
    try {
      await confirmSignUp({ username: email, confirmationCode: confirmCode })
      await signIn({ username: email, password })
      onAuthSuccess()
    } catch (err) {
      setError(err.message || 'Confirmation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Left panel — branding */}
      <div style={styles.brandPanel}>
        <div style={styles.brandContent}>
          <h1 style={styles.logo}>TOPSY</h1>
          <p style={styles.tagline}>
            Fashion made for you.<br />
            Styles that speak to you.
          </p>
          <div style={styles.categories}>
            {['In-Office', 'Out-of-Office', 'Casual', 'Spicy'].map(cat => (
              <span key={cat} style={styles.categoryTag}>{cat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth forms */}
      <div style={styles.authPanel}>

        {/* Landing — choose sign in or sign up */}
        {mode === 'landing' && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Welcome to Topsy</h2>
            <p style={styles.formSubtitle}>Ghana's fashion marketplace for women</p>
            <button style={styles.primaryButton} onClick={() => setMode('signin')}>
              Sign In
            </button>
            <button style={styles.secondaryButton} onClick={() => setMode('signup')}>
              Create Account
            </button>
            <div style={styles.divider}>
              <span>or</span>
            </div>
            <button
              style={styles.googleButton}
              onClick={() => signInWithRedirect({ provider: 'Google' })}
            >
              Continue with Google
            </button>
          </div>
        )}

        {/* Sign In form */}
        {mode === 'signin' && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Sign In</h2>
            {error && <p style={styles.error}>{error}</p>}
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              style={styles.primaryButton}
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button style={styles.linkButton} onClick={() => setMode('landing')}>
              Back
            </button>
          </div>
        )}

        {/* Sign Up form */}
        {mode === 'signup' && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Create Account</h2>
            {error && <p style={styles.error}>{error}</p>}
            <input
              style={styles.input}
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div style={styles.roleSelector}>
              <p style={styles.roleLabel}>I want to:</p>
              <div style={styles.roleOptions}>
                <button
                  style={role === 'buyer' ? styles.roleActive : styles.roleInactive}
                  onClick={() => setRole('buyer')}
                >
                  Shop on Topsy
                </button>
                <button
                  style={role === 'seller' ? styles.roleActive : styles.roleInactive}
                  onClick={() => setRole('seller')}
                >
                  Sell on Topsy
                </button>
              </div>
            </div>
            <button
              style={styles.primaryButton}
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <button style={styles.linkButton} onClick={() => setMode('landing')}>
              Back
            </button>
          </div>
        )}

        {/* Confirm email */}
        {mode === 'confirm' && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Check your email</h2>
            <p style={styles.formSubtitle}>
              We sent a verification code to {email}
            </p>
            {error && <p style={styles.error}>{error}</p>}
            <input
              style={styles.input}
              type="text"
              placeholder="Enter verification code"
              value={confirmCode}
              onChange={e => setConfirmCode(e.target.value)}
            />
            <button
              style={styles.primaryButton}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Inter, sans-serif'
  },
  brandPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a1a1a 0%, #3d1f2a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  brandContent: {
    color: '#ffffff',
    textAlign: 'center'
  },
  logo: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '4rem',
    fontWeight: '700',
    letterSpacing: '0.3em',
    color: '#ffffff',
    marginBottom: '1rem'
  },
  tagline: {
    fontSize: '1.2rem',
    color: '#e8d5c4',
    lineHeight: '1.8',
    marginBottom: '2rem'
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center'
  },
  categoryTag: {
    padding: '0.4rem 1rem',
    border: '1px solid #e8d5c4',
    borderRadius: '20px',
    color: '#e8d5c4',
    fontSize: '0.85rem'
  },
  authPanel: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf7f4',
    padding: '2rem'
  },
  formContainer: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.8rem',
    color: '#1a1a1a',
    marginBottom: '0.25rem'
  },
  formSubtitle: {
    color: '#6b6b6b',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  input: {
    padding: '0.85rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%'
  },
  primaryButton: {
    padding: '0.9rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  },
  secondaryButton: {
    padding: '0.9rem',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1.5px solid #1a1a1a',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  },
  googleButton: {
    padding: '0.9rem',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#6b6b6b',
    fontSize: '0.85rem',
    textAlign: 'center'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#c9647a',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textAlign: 'center'
  },
  roleSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  roleLabel: {
    fontSize: '0.9rem',
    color: '#6b6b6b'
  },
  roleOptions: {
    display: 'flex',
    gap: '0.75rem'
  },
  roleActive: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  roleInactive: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.85rem',
    padding: '0.75rem',
    backgroundColor: '#fdf0ef',
    borderRadius: '6px'
  }
}

export default Login
