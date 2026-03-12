import api from '../utils/api'

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { username, email, password, role }
 * Returns: UserResponse
 */
export const register = (data) => api.post('/api/auth/register', data)

/**
 * Login with username and password
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { access_token, token_type, user }
 */
export const loginUser = ({username,password}) => 
{
    const params = new URLSearchParams()
    params.append('username',username)
    params.append('password',password)
    return api.post('/api/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * Get current logged-in user
 * GET /api/auth/me
 * Requires JWT token (auto-attached by interceptor)
 * Returns: UserResponse
 */
export const getProfile = () => api.get('/api/auth/profile')