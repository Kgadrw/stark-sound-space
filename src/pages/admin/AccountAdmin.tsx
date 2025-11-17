import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AccountAdmin = () => {
  const { updateCredentials, username } = useAuth();
  const [formState, setFormState] = useState({
    currentPassword: "",
    username: username ?? "",
    password: "",
  });
  const [status, setStatus] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      await updateCredentials({
        currentPassword: formState.currentPassword,
        username: formState.username,
        password: formState.password || undefined,
      });
      setFormState((prev) => ({ ...prev, currentPassword: "", password: "" }));
      setStatus({ message: "Credentials updated successfully.", tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update credentials";
      setStatus({ message, tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 rounded-lg border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
      <div>
        <p className="text-sm text-white/50 mb-1">Account Settings</p>
        <h2 className="text-2xl font-semibold text-white">Security Settings</h2>
      </div>
      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader>
          <CardTitle className="text-white">Update Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Current Password</label>
              <Input
                type="password"
                value={formState.currentPassword}
                onChange={(event) => setFormState((prev) => ({ ...prev, currentPassword: event.target.value }))}
                required
                placeholder="Enter your current password"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Username</label>
              <Input
                value={formState.username}
                onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                required
                placeholder="Enter new username"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">New Password</label>
              <Input
                type="password"
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Leave blank to keep existing password"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
            </div>
            {status && (
              <p className={`text-sm ${status.tone === "success" ? "text-green-400" : "text-red-400"}`}>{status.message}</p>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AccountAdmin;


