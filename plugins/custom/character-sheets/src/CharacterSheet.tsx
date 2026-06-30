import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "./util/lang";
import { StatusBadge, statusBadgeStyles } from "@grimoire/shared";
import style from "./styles/sheet.scss";

interface PersonalidadAxes {
  flexible_adoquin?: number;
  miedica_temerario?: number;
  desaborido_ladino?: number;
  discapacidades_avispado?: number;
  negado_acrobatico?: number;
  sensato_lunatico?: number;
}

interface SheetFrontmatter {
  title?: string;
  tags?: string[];
  clase?: string;
  raza?: string;
  estado?: string;
  alineamiento?: string;
  personalidad?: PersonalidadAxes;
  origen?: string;
  ideales?: string;
  lazos?: string;
  defectos?: string;
  puntos_fuertes?: string[];
  puntos_debiles?: string[];
}

const PERSONALITY_AXES: Array<{ key: keyof PersonalidadAxes; low: string; high: string }> = [
  { key: "flexible_adoquin", low: "Flexible", high: "Adoquín" },
  { key: "miedica_temerario", low: "Miedica", high: "Temerario" },
  { key: "desaborido_ladino", low: "Desaborido", high: "Ladino" },
  { key: "discapacidades_avispado", low: "Altas discapacidades", high: "Avispado" },
  { key: "negado_acrobatico", low: "Negado", high: "Acrobático" },
  { key: "sensato_lunatico", low: "Sensato", high: "Lunático" },
];

function hasContent(arr?: string[]): arr is string[] {
  return Array.isArray(arr) && arr.length > 0 && arr[0] !== "";
}

function hasPersonalidad(p?: PersonalidadAxes): boolean {
  if (!p || typeof p !== "object") return false;
  return PERSONALITY_AXES.some((axis) => typeof p[axis.key] === "number");
}

export default ((userOpts?: Record<string, unknown>) => {
  const CharacterSheet: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const slug = fileData.slug as string | undefined;
    if (!slug) return null;

    if (!slug.startsWith("wiki/personajes/")) return null;
    if (slug === "wiki/personajes/index" || slug === "wiki/personajes") return null;

    const fm = fileData.frontmatter as (SheetFrontmatter & Record<string, unknown>) | undefined;
    if (!fm) return null;

    const tags = fm.tags;
    if (!Array.isArray(tags) || !tags.includes("personaje/jugador")) return null;

    const clase = fm.clase;
    const raza = fm.raza;

    const estado = fm.estado;
    const alineamiento = fm.alineamiento;
    const personalidad = fm.personalidad;
    const origen = fm.origen;
    const ideales = fm.ideales;
    const lazos = fm.lazos;
    const defectos = fm.defectos;
    const puntosFuertes = fm.puntos_fuertes;
    const puntosDebiles = fm.puntos_debiles;

    const hasPersonality = hasPersonalidad(personalidad);
    const hasTraits = hasPersonality || origen || ideales || lazos || defectos;
    const hasStrengthsWeaknesses = hasContent(puntosFuertes) || hasContent(puntosDebiles);

    if (!hasTraits && !hasStrengthsWeaknesses && !alineamiento && !clase && !raza) {
      return null;
    }

    const subtitleParts: string[] = [];
    if (clase) {
      subtitleParts.push(clase);
    }
    if (raza) subtitleParts.push(raza);

    const secondLine: string[] = [];
    if (alineamiento) secondLine.push(alineamiento);

    return (
      <div class={classNames(displayClass, "character-sheet")}>
        <div class="cs-header">
          <div class="cs-header__info">
            {subtitleParts.length > 0 && (
              <p class="cs-header__subtitle">{subtitleParts.join(" · ")}</p>
            )}
            {secondLine.length > 0 && (
              <p class="cs-header__detail">{secondLine.join(" · ")}</p>
            )}
          </div>
          <StatusBadge estado={estado} />
        </div>

        {hasTraits && (
          <div class="cs-body">
            {(hasPersonality || origen) && (
              <div class="cs-col cs-col--traits">
                {origen && (
                  <div class="cs-traits__item">
                    <span class="cs-traits__label">📜 Origen</span>
                    <p class="cs-traits__text">{origen}</p>
                  </div>
                )}
                {hasPersonality && personalidad && (
                  <div class="cs-personality">
                    <span class="cs-traits__label">🎭 Personalidad</span>
                    <div class="cs-personality__bars">
                      {PERSONALITY_AXES.map((axis) => {
                        const value = personalidad[axis.key];
                        if (typeof value !== "number") return null;
                        const clamped = Math.max(0, Math.min(100, value));
                        return (
                          <div class="cs-bar" key={axis.key}>
                            <span class="cs-bar__label cs-bar__label--low">{axis.low}</span>
                            <div class="cs-bar__track">
                              <div class="cs-bar__fill" style={{ width: `${clamped}%` }} />
                            </div>
                            <span class="cs-bar__label cs-bar__label--high">{axis.high}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {(ideales || lazos || defectos) && (
              <div class="cs-col">
                {ideales && (
                  <div class="cs-traits__item">
                    <span class="cs-traits__label">Ideales</span>
                    <p class="cs-traits__text">{ideales}</p>
                  </div>
                )}
                {lazos && (
                  <div class="cs-traits__item">
                    <span class="cs-traits__label">Lazos</span>
                    <p class="cs-traits__text">{lazos}</p>
                  </div>
                )}
                {defectos && (
                  <div class="cs-traits__item">
                    <span class="cs-traits__label">Defectos</span>
                    <p class="cs-traits__text">{defectos}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {hasStrengthsWeaknesses && (
          <div class="cs-row">
            {hasContent(puntosFuertes) && (
              <div class="cs-row__section">
                <span class="cs-traits__label">💪 Puntos Fuertes</span>
                <ul class="cs-list cs-list--strong">
                  {puntosFuertes.map((p) => (
                    <li>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {hasContent(puntosDebiles) && (
              <div class="cs-row__section">
                <span class="cs-traits__label">💔 Puntos Débiles</span>
                <ul class="cs-list cs-list--weak">
                  {puntosDebiles.map((p) => (
                    <li>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  CharacterSheet.css = style + statusBadgeStyles;
  return CharacterSheet;
}) satisfies QuartzComponentConstructor;
