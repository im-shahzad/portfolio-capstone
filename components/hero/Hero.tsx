"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AccentSwitcher } from "@/components/theme/accent-switcher";
import { HeroShader } from "@/components/hero/HeroShader";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero({
  onLaunchChat,
}: {
  onLaunchChat?: () => void;
}) {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-16 text-center">
      <HeroShader className="motion-reduce:hidden" />

      <div className="absolute top-4 right-0 z-20 flex items-center gap-3 sm:top-6">
        <AccentSwitcher />
        <ThemeToggle />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex max-w-2xl flex-col items-center gap-6 px-4"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
        >
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Available for AI engineering internships
        </motion.span>

        <motion.h1 variants={fadeUp} className="text-4xl font-semibold sm:text-5xl">
          Shahzad
        </motion.h1>

        <motion.p variants={fadeUp} className="max-w-prose text-lg text-muted-foreground">
          I build AI-powered applications people can actually use, not just API
          demonstrations.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onLaunchChat}
            nativeButton={!onLaunchChat ? false : undefined}
            render={onLaunchChat ? undefined : <Link href="/chat" />}
          >
            Ask AI Assistant &rarr;
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/work" />}
          >
            See work
          </Button>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
