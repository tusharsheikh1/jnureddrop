// Register page now lives inside LoginPage (tab switcher).
// This redirect preserves any direct /donor/register links.
import { Navigate } from 'react-router-dom';
export default function DonorRegisterPage() {
  return <Navigate to="/donor/login" replace />;
}
