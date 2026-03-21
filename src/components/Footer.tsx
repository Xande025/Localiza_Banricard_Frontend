'use client';

import Image from 'next/image';
import { Github, Instagram, Linkedin } from 'lucide-react';

const FOOTER_TEXT =
  'Encontre restaurantes, postos, farmácias e outros estabelecimentos que aceitam Banricard Vale Refeição no RS';

const LINKEDIN_URL = 'https://www.linkedin.com/in/alexandre-radmann/';
const GITHUB_URL = 'https://github.com/alexandre-radmann';
const INSTAGRAM_URL = 'https://www.instagram.com/';

const socialBtn =
  'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden bg-white">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-yellow"
      />
      <div className="border-t border-border py-6">
        <div className="container mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={socialBtn}
            >
              <Github className="h-5 w-5 text-[#181717]" aria-hidden />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialBtn}
            >
              <Linkedin className="h-5 w-5 text-[#0A66C2]" aria-hidden />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={socialBtn}
            >
              <Instagram className="h-5 w-5 text-[#E4405F]" aria-hidden />
            </a>
          </div>

          <p className="max-w-2xl text-balance text-sm font-medium leading-snug text-muted-foreground sm:text-base">
            {FOOTER_TEXT}
          </p>

          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full justify-center">
              <Image
                src="/logo_mobile2.svg"
                alt="Localiza Banricard"
                width={360}
                height={80}
                className="h-32 w-auto max-w-[min(100%,460px)] object-contain sm:h-36 md:hidden"
              />
              <Image
                src="/Logo_desktop.svg"
                alt="Localiza Banricard"
                width={440}
                height={80}
                className="hidden h-[52px] w-auto max-w-[min(100%,480px)] object-contain md:block lg:h-[72px]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Desenvolvido por{' '}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                Alexandre Radmann
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
