import { redirect } from 'next/navigation';

export default function DashboardSignInRedirect() {
  redirect('/signin?next=/dashboard');
}
