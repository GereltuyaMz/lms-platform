import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user, redirect to sign in
  if (error || !user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID */}
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{user.id}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            {/* Full Name */}
            {user.user_metadata?.full_name && (
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{user.user_metadata.full_name}</p>
              </div>
            )}

            {/* Email Confirmed */}
            <div>
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-medium">
                {user.email_confirmed_at ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⚠ Not Verified</span>
                )}
              </p>
            </div>

            {/* Auth Provider */}
            <div>
              <p className="text-sm text-gray-500">Sign In Provider</p>
              <p className="font-medium capitalize">
                {user.app_metadata?.provider || "email"}
              </p>
            </div>

            {/* Created At */}
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Raw User Object (for debugging) */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
              View Raw User Object
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
