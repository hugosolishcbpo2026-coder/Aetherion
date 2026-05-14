import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Vendors"
      title="Vendors"
      description="External contractors, service providers, and partners. Ratings, pricing, service areas."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Building2 className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="No vendors yet."
        description="Add plumbers, electricians, translators, photographers — any external service provider."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
