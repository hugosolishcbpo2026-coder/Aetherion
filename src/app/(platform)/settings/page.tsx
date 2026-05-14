import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Settings"
      title="Settings"
      description="Organization, branding, roles, permissions, API keys, billing."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Settings className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Configure your workspace."
        description="Roles, permissions, branding, integrations, and billing all live here."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
