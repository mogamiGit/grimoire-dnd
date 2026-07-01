import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
} from "@quartz-community/types";
import { classNames } from "./util/lang";
import { resolveRelative } from "./util/path";
import { StatusBadge, statusBadgeStyles } from "@grimoire/shared";
import style from "./styles/cards.scss";

interface CharacterFrontmatter {
  title?: string;
  nickname?: string;
  tags?: string[];
  estado?: string;
}

type CharacterFile = QuartzPluginData & {
  frontmatter?: CharacterFrontmatter & Record<string, unknown>;
};

export default ((userOpts?: Record<string, unknown>) => {
  const CharacterCards: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const slug = fileData.slug as string | undefined;
    if (!slug) return null;

    // Only render on personajes index page
    if (slug !== "wiki/personajes/index" && slug !== "wiki/personajes") return null;

    const characters = (allFiles as CharacterFile[]).filter((f) => {
      const tags = f.frontmatter?.tags;
      return Array.isArray(tags) && tags.includes("personaje/jugador");
    });

    if (characters.length === 0) return null;

    // Sort alphabetically by title
    characters.sort((a, b) => {
      const titleA = a.frontmatter?.title ?? "";
      const titleB = b.frontmatter?.title ?? "";
      return titleA.localeCompare(titleB, "es");
    });

    return (
      <div class={classNames(displayClass, "character-cards")}>
        <div class="character-cards__grid">
          {characters.map((char) => {
            const fm = char.frontmatter;
            const title = fm?.title ?? "Sin nombre";
            const nickname = fm?.nickname;
            const estado = fm?.estado;

            return (
              <a
                href={resolveRelative(slug, char.slug!)}
                class="character-card internal"
              >
                <div class="character-card__header">
                  <div>
                    <h3 class="character-card__name">{title}</h3>
                    {nickname && <p class="character-card__nickname">({nickname})</p>}
                  </div>
                  <StatusBadge estado={estado} fallback="vivo" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  CharacterCards.css = style + statusBadgeStyles;
  return CharacterCards;
}) satisfies QuartzComponentConstructor;
