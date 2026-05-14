import { Plus, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="CRM · Pipelines"
      title="Pipelines"
      description="Configurable kanban-style pipelines. Each organization defines its own stages and probability weights."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Workflow className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Build your first pipeline."
        description="Sales, legal cases, maintenance requests — any process with stages can become a pipeline."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
