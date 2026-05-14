import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Marketplace"
      title="Marketplace"
      description="Properties, services, legal procedures — one catalog engine, infinite verticals."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<ShoppingBag className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Your catalog is empty."
        description="Add listings — properties for TropicCo, legal procedure templates for Notaría 322, or anything else."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
