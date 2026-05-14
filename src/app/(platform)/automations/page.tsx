import { Plus, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Automations"
      title="Automation Engine"
      description="Event, schedule, and webhook triggers. Configure workflows without writing code."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Workflow className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Build your first automation."
        description="Example: when a client signs a deed, send the invoice and create a follow-up task in 30 days."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
