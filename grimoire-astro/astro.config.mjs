// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightObsidian, { obsidianSidebarEntries } from 'starlight-obsidian';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dnd.mogamihub.xyz',

  integrations: [
    starlight({
      title: 'Grimoire DnD',
      defaultLocale: 'es',
      customCss: ['./src/styles/global.css'],
      components: {
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mogamiGit/grimoire-dnd',
        },
      ],
      plugins: [
        starlightObsidian({
          vault: '..',
          copyFrontmatter: 'all',
          ignore: [
            '_templates',
            '_rules',
            '_docs',
            '.obsidian',
            'node_modules',
            '.claude',
            '.github',
            '.vscode',
            'grimoire-astro',
          ],
        }),
      ],
      sidebar: [
        {
          label: 'Campaign',
          items: [obsidianSidebarEntries],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
