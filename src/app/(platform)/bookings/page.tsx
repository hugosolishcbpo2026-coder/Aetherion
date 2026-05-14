import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Bookings"
      title="Bookings"
      description="Appointments, viewings, signings — with reminders and payment built in."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Calendar className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Your calendar is clear."
        description="Bookings appear here as they're scheduled by clients, staff, or automations."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
