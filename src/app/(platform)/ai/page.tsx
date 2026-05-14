import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="AI Studio"
      title="AI Studio"
      description="Design, version, and deploy your AI assistants. Website concierge, CRM copilot, voice agents."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<Sparkles className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Six default assistants ready to deploy."
        description="Configure system prompts, choose models, set temperature, version your prompts per organization."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
