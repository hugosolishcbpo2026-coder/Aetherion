import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Messaging"
      title="Messages"
      description="Email, SMS, WhatsApp, and in-app messages — threaded against the client record."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<MessageSquare className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Inbox zero."
        description="Inbound messages, sent emails, and SMS conversations will appear here."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
