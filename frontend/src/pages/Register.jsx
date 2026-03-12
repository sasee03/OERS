import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(form)
      navigate('/login', {
        state: { message: 'Account created successfully! Please log in.' },
      })
    } catch (err) {
      const detail = err.response?.data?.detail
      // Pydantic validation errors come as an array
      if (Array.isArray(detail)) {
        setError(detail[0].msg)
      } else {
        setError(detail || 'Registration failed. Please try again.')
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
          <h1>Create Account</h1>
          <p>Join ExamPortal today</p>
        </div>

        <form onSubmit={handleSubmit} className='auth-form'>

          {error && <div className='error-box'>{error}</div>}

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
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='john@example.com'
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
              placeholder='Minimum 6 characters'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='role'>Register As</label>
            <select
              id='role'
              name='role'
              value={form.role}
              onChange={handleChange}
            >
              <option value='student'>Student</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <button type='submit' className='btn-primary' disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className='auth-switch'>
          Already have an account? <Link to='/login'>Sign In</Link>
        </p>

      </div>
    </div>
  )
}