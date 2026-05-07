import Container from "@/components/layout/container";
import { getCurrentUser } from "@/server/user";

export default async function DashboardPage() {
  // This server function will redirect to /login if not authenticated
  const { currentUser } = await getCurrentUser();

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {currentUser?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Email: {currentUser?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Account</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">
              View your financial analytics and reports
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground">
              Configure your app settings and preferences
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
