import { STATUS_LABELS } from "./constants";

interface StatusBadgeProps {
  estado?: string;
  fallback?: string;
}

export function StatusBadge({ estado, fallback }: StatusBadgeProps) {
  const status = estado || fallback;
  if (!status) return null;
  const label = STATUS_LABELS[status] ?? status;
  const cssClass = STATUS_LABELS[status] ? status : "otro";
  return <span class={`status-badge status-badge--${cssClass}`}>{label}</span>;
}

export const statusBadgeStyles = `
.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-badge--vivo { background: #2d6a2e; color: #e8f5e9; }
.status-badge--muerto { background: #8b2020; color: #fce4ec; }
.status-badge--desaparecido { background: #b8860b; color: #fff8e1; }
.status-badge--otro { background: var(--gray); color: var(--light); }
`;
