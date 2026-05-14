import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModulePage, ModuleEmptyState } from '@/components/layout/module-page';

export default function Page() {
  return (
    <ModulePage
      eyebrow="Documents"
      title="Documents"
      description="Versioned uploads, e-signing, audit trail. Linked to clients, bookings, or any other record."
      actions={
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      }
    >
      <ModuleEmptyState
        icon={<FileText className="h-5 w-5 text-gold-300" strokeWidth={1.5} />}
        title="Your vault is empty."
        description="Upload contracts, deeds, IDs, or any file. Categorize and link to the relevant record."
        action={<Button size="sm">Get started</Button>}
      />
    </ModulePage>
  );
}
