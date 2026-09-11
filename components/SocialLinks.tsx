import { Code2, Mail, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/chatConfig";
import { cn } from "@/lib/utils";

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const DEFAULT_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/im-shahzad", icon: Code2 },
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
];

export default function SocialLinks({
  links = DEFAULT_LINKS,
  className,
}: {
  links?: SocialLink[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map(({ label, href, icon: Icon }) => (
        <Button
          key={href}
          variant="ghost"
          size="icon"
          aria-label={label}
          nativeButton={false}
          render={
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
            />
          }
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
