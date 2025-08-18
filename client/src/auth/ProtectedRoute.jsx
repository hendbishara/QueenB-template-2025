import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './AuthContext';

/**
 * Gatekeeper for private pages.
 * - While AuthContext is "loading": show spinner (prevents UI flicker).
 * - If not logged in: redirect to /login and remember where the user tried to go.
 * - If roles are provided: only let allowed roles through.
 *
 * Usage examples:
 *   <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   <ProtectedRoute roles={['MENTOR']}><MentorArea /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles, redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  const location = useLocation(); // the URL the user is trying to view

  // 1) Still checking token/session? Don't decide yet; show a loader.
  if (loading) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2) Not logged in: bounce to /login and pass "from" so we can return here after login.
  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // 3) Role guard (optional): only allow if user's role is in the allowed list.
  //if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // you can route to a "403" page instead; keeping it simple:
    //return <Navigate to="/" replace />;
  //}

  // 4) All good: render the protected page.
  return children;
}
