import { Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Analytics"
      title="Analytics"
      description="Revenue, retention, pipeline velocity, AI-narrated insights. Roll up across organizations."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<BarChart3 className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Charts will appear as data flows in."
        description="Once you have clients, bookings, and transactions, this becomes your command center."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
