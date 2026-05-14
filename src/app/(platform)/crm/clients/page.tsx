import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="CRM · Clients"
      title="Clients"
      description="Centralized client database with pipelines, tasks, and AI-generated summaries."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Users className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Your client roster lives here."
        description="Import contacts from a spreadsheet, sync with a CRM, or add your first client manually."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
