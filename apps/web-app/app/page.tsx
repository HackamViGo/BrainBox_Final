import { redirect } from 'next/navigation';

/**
 * Root Page of the BrainBox SPA.
 * Redirects exactly to the dashboard route where the persistent shell is mounted.
 */
export default function HomePage() {
  redirect('/dashboard');
}
