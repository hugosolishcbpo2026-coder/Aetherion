import { Plus, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="CRM · Tasks"
      title="Tasks"
      description="Polymorphic tasks attached to clients, bookings, deals, or anything else."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<ListTodo className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Nothing on your plate."
        description="Tasks created here automatically link to the relevant client, deal, or booking."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
