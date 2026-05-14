import { Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Memberships"
      title="Memberships"
      description="Recurring revenue with benefit tiers, member portals, and Stripe-backed billing."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Crown className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="No membership plans yet."
        description="Create tiered plans (Bronze, Silver, Gold, Platinum) with custom benefits and pricing."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
