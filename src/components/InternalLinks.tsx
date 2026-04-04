'use client';

import Link from "next/link";

const links = [
  { label: "IJMB Registration", href: "/ijmb-registration" },
  { label: "IJMB Requirements", href: "/ijmb-admission-requirements" },
  { label: "IJMB Fees", href: "/ijmb-fees" },
  { label: "Study Centres", href: "/ijmb-centres-in-nigeria" },
  { label: "Accepting Universities", href: "/universities-accepting-ijmb" },
];

const InternalLinks = ({ exclude }: { exclude?: string }) => (
  <div className="flex flex-wrap gap-2 mt-8">
    {links
      .filter((l) => l.href !== exclude)
      .map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {l.label}
        </Link>
      ))}
  </div>
);

export default InternalLinks;
