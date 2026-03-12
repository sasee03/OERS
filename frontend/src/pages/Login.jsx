import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // Message passed from Register page on successful registration
  const successMsg = location.state?.message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await loginUser(form)

      // Store token + user in context and localStorage
      login(data.user, data.access_token)

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/student')
      }
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail[0].msg)
      } else {
        setError(detail || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>

        <div className='auth-header'>
          <div className='auth-logo'>📝</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className='auth-form'>

          {successMsg && <div className='success-box'>{successMsg}</div>}
          {error      && <div className='error-box'>{error}</div>}

          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              name='username'
              type='text'
              value={form.username}
              onChange={handleChange}
              placeholder='johndoe'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='••••••••'
              required
            />
          </div>

          <button type='submit' className='btn-primary' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className='auth-switch'>
          Don't have an account? <Link to='/register'>Register</Link>
        </p>

      </div>
    </div>
  )
}