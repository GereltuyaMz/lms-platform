import LoginForm from "@/components/auth/LoginForm";
import UserProfile from "@/components/auth/UserProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Supabase + shadcn/ui Integration
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is an example page demonstrating Supabase authentication with
            beautiful shadcn/ui components. Try signing up and logging in below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Authentication</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in or create a new account
              </p>
            </div>
            <LoginForm />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Current User</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your profile information
              </p>
            </div>
            <UserProfile />
          </div>
        </div>

        <Card className="mt-12 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>
              Follow these steps to get started with Supabase authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Make sure you&apos;ve set up your Supabase project and added the
                credentials to{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  .env.local
                </code>
              </li>
              <li>
                Enable Email authentication in your Supabase dashboard
                (Authentication → Providers → Email)
              </li>
              <li>Try signing up with a new email and password</li>
              <li>
                Check your email for the verification link (if you have email
                confirmation enabled)
              </li>
              <li>
                After verification, you can sign in and see your user profile
              </li>
            </ol>

            <div className="mt-6 p-4 bg-muted rounded-lg border">
              <p className="text-sm">
                <strong>Note:</strong> This is just an example. You can delete
                this page by removing the{" "}
                <code className="bg-background px-1.5 py-0.5 rounded text-sm border">
                  src/app/example
                </code>{" "}
                directory.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
