import { redirect } from 'next/navigation';

export default function DashboardSignUpRedirect() {
  redirect('/signup?next=/dashboard');
}
