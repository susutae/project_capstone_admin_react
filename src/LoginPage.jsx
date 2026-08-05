import { useState } from 'react'
import { useLogin } from 'react-admin'
import {
  AdminPanelSettingsRounded,
  ArrowForwardRounded,
  LockOutlined,
  MailOutlineRounded,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

export const LoginPage = () => {
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (loginError) {
      setError(loginError?.message || 'Unable to sign in. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-labelledby="login-heading">
        <Box className="login-brand">
          <Box className="login-brand__mark">C</Box>
          <Box>
            <Typography className="login-brand__name">Capstone</Typography>
            <Typography className="login-brand__label">Commerce admin</Typography>
          </Box>
        </Box>

        <Box className="login-intro__content">
          <Typography className="login-intro__eyebrow">
            Administration portal
          </Typography>
          <Typography component="h1" id="login-heading" className="login-intro__title">
            Run your store
            <br />
            with clarity.
          </Typography>
          <Typography className="login-intro__description">
            Manage products, fulfill orders, and keep every part of your commerce
            operation moving from one secure workspace.
          </Typography>
        </Box>

        <Typography className="login-intro__footer">
          Capstone Commerce &middot; Administrator access
        </Typography>
      </section>

      <section className="login-panel" aria-label="Administrator sign in">
        <Box className="login-card">
          <Box className="login-card__icon" aria-hidden="true">
            <AdminPanelSettingsRounded />
          </Box>
          <Typography component="h2" className="login-card__title">
            Welcome back
          </Typography>
          <Typography className="login-card__subtitle">
            Enter your account credentials to continue.
          </Typography>

          <Box component="form" className="login-form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" className="login-form__alert">
                {error}
              </Alert>
            )}

            <TextField
              autoComplete="username"
              autoFocus
              fullWidth
              label="Email address"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError('')
              }}
              required
              type="email"
              value={email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              autoComplete="current-password"
              fullWidth
              label="Password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) setError('')
              }}
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        edge="end"
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              className="login-form__submit"
              disabled={isSubmitting || !email.trim() || !password}
              endIcon={<ArrowForwardRounded />}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Box className="login-card__notice">
            <LockOutlined />
            <Typography>
              Restricted area. Access is limited to authorized administrators.
            </Typography>
          </Box>
        </Box>
      </section>
    </main>
  )
}
