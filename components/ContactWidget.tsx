import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/chatConfig";

export default function ContactWidget({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 ${className ?? ""}`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-text">
        <Mail className="size-4 text-accent" aria-hidden="true" />
        Let&apos;s connect
      </p>
      <p className="text-sm text-muted-foreground">
        Reach out directly or use the contact form.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          nativeButton={false}
          render={<a href={`mailto:${CONTACT_EMAIL}`} />}
        >
          Email me
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<Link href="/contact" />}
        >
          Contact form
        </Button>
      </div>
    </div>
  );
}
