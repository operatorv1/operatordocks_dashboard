import { useState } from "react";
import { User as UserIcon, Bell, Shield, Palette, Save } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Settings() {
  usePageMeta("Settings");
  const { user } = useAuth();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace Settings"
        subtitle="Manage your profile, preferences, and security."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-brand" />
            <h3 className="font-display text-base font-semibold text-white">Profile</h3>
          </div>
          <div className="mb-6 flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-16 w-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="brand-gradient grid h-16 w-16 place-items-center rounded-2xl font-display text-xl font-bold">
                {user?.email?.slice(0, 2).toUpperCase() ?? "OP"}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate font-display text-lg font-semibold text-white">
                {user?.displayName ?? "Admin User"}
              </div>
              <div className="truncate text-sm text-muted-foreground">
                {user?.email ?? "admin@operatordocks.com"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Display Name" defaultValue={user?.displayName ?? ""} placeholder="Your name" />
            <Field label="Email" defaultValue={user?.email ?? ""} type="email" disabled />
            <Field label="Role" defaultValue="Operations Admin" />
            <Field label="Timezone" defaultValue="UTC+05:30 (IST)" />
          </div>

          <button
            onClick={() => toast.success("Profile saved")}
            className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-glow hover:opacity-95"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand" />
              <h3 className="font-display text-base font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-3">
              <Toggle label="Email alerts" checked={notifEmail} onChange={setNotifEmail} />
              <Toggle label="Push notifications" checked={notifPush} onChange={setNotifPush} />
              <Toggle label="Weekly digest" checked={notifDigest} onChange={setNotifDigest} />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              <h3 className="font-display text-base font-semibold text-white">Security</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-surface/40 p-3">
                <span className="text-muted-foreground">Two-factor auth</span>
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">
                  Enabled
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-surface/40 p-3">
                <span className="text-muted-foreground">Active sessions</span>
                <span className="text-white">3</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-surface/40 p-3">
                <span className="text-muted-foreground">Last sign-in</span>
                <span className="text-white">Just now</span>
              </li>
            </ul>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-brand" />
              <h3 className="font-display text-base font-semibold text-white">Appearance</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              Dark theme active  optimized for 24/7 operations rooms.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-surface py-2.5 px-3 text-sm text-white placeholder:text-muted-foreground/60 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg bg-surface/40 p-3">
      <span className="text-sm text-white">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "brand-gradient" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
