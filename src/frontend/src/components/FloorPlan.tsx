import type { Table } from "../backend";
import { TableStatus } from "../backend";

interface FloorPlanProps {
  tables: Table[];
  selectedTableId: bigint | null;
  onSelectTable: (table: Table) => void;
}

const STATUS_FILL: Record<TableStatus, string> = {
  [TableStatus.available]: "oklch(0.68 0.18 65 / 0.18)",
  [TableStatus.reserved]: "oklch(0.35 0.015 50 / 0.85)",
  [TableStatus.occupied]: "oklch(0.52 0.18 25 / 0.55)",
  [TableStatus.maintenance]: "oklch(0.28 0.01 50 / 0.7)",
};

const STATUS_STROKE: Record<TableStatus, string> = {
  [TableStatus.available]: "oklch(0.68 0.18 65 / 0.8)",
  [TableStatus.reserved]: "oklch(0.45 0.015 50 / 0.6)",
  [TableStatus.occupied]: "oklch(0.62 0.2 25 / 0.7)",
  [TableStatus.maintenance]: "oklch(0.38 0.01 50 / 0.5)",
};

const STATUS_LABEL: Record<TableStatus, string> = {
  [TableStatus.available]: "Available",
  [TableStatus.reserved]: "Reserved",
  [TableStatus.occupied]: "Occupied",
  [TableStatus.maintenance]: "Maintenance",
};

// Fixed layout grid positions for 10 restaurant tables
const TABLE_LAYOUT = [
  { x: 80, y: 120, w: 72, h: 56 }, // Table 1 - left row
  { x: 80, y: 220, w: 72, h: 56 }, // Table 2
  { x: 80, y: 320, w: 72, h: 56 }, // Table 3
  { x: 200, y: 140, w: 88, h: 64 }, // Table 4 - center
  { x: 200, y: 250, w: 88, h: 64 }, // Table 5
  { x: 200, y: 360, w: 88, h: 64 }, // Table 6
  { x: 340, y: 120, w: 72, h: 56 }, // Table 7 - right
  { x: 340, y: 220, w: 72, h: 56 }, // Table 8
  { x: 340, y: 320, w: 72, h: 56 }, // Table 9
  { x: 460, y: 180, w: 88, h: 72 }, // Table 10 - far right
];

export function FloorPlan({
  tables,
  selectedTableId,
  onSelectTable,
}: FloorPlanProps) {
  const getLayout = (index: number) =>
    TABLE_LAYOUT[index % TABLE_LAYOUT.length];

  return (
    <div
      className="relative w-full overflow-x-auto"
      data-ocid="floorplan.section"
    >
      <svg
        viewBox="0 0 600 480"
        className="w-full max-w-2xl mx-auto h-auto"
        style={{ filter: "drop-shadow(0 4px 24px oklch(0 0 0 / 0.5))" }}
        role="img"
        aria-label="Restaurant floor plan"
      >
        {/* Floor background */}
        <defs>
          <pattern
            id="floor-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill="oklch(0.14 0.015 50)" />
            <path
              d="M0 20L20 0M-5 5L5 -5M15 25L25 15"
              stroke="oklch(0.2 0.015 50)"
              strokeWidth="0.5"
            />
          </pattern>
          <filter id="glow-gold">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="selected-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.68 0.18 65 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.68 0.18 65 / 0)" />
          </radialGradient>
        </defs>

        {/* Floor surface */}
        <rect
          x="10"
          y="10"
          width="580"
          height="460"
          rx="12"
          fill="url(#floor-pattern)"
          stroke="oklch(0.25 0.02 50)"
          strokeWidth="1"
        />

        {/* ── Zone labels ── */}
        {/* Entrance */}
        <g>
          <rect
            x="230"
            y="430"
            width="140"
            height="30"
            rx="6"
            fill="oklch(0.2 0.02 50 / 0.9)"
            stroke="oklch(0.68 0.18 65 / 0.3)"
            strokeWidth="1"
          />
          <text
            x="300"
            y="450"
            textAnchor="middle"
            fill="oklch(0.68 0.18 65 / 0.9)"
            fontSize="11"
            fontFamily="var(--font-body)"
            letterSpacing="2"
          >
            ENTRANCE
          </text>
        </g>
        {/* Arrow pointing up from entrance */}
        <path
          d="M300 420 L300 408 M295 413 L300 408 L305 413"
          stroke="oklch(0.68 0.18 65 / 0.4)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bar area */}
        <g>
          <rect
            x="470"
            y="20"
            width="110"
            height="110"
            rx="8"
            fill="oklch(0.18 0.02 50 / 0.9)"
            stroke="oklch(0.68 0.18 65 / 0.25)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x="525"
            y="62"
            textAnchor="middle"
            fill="oklch(0.68 0.18 65 / 0.7)"
            fontSize="10"
            fontFamily="var(--font-body)"
            letterSpacing="1.5"
          >
            BAR
          </text>
          <text
            x="525"
            y="76"
            textAnchor="middle"
            fill="oklch(0.68 0.18 65 / 0.7)"
            fontSize="10"
            fontFamily="var(--font-body)"
            letterSpacing="1.5"
          >
            LOUNGE
          </text>
          {/* Bar counter */}
          <rect
            x="478"
            y="86"
            width="94"
            height="10"
            rx="4"
            fill="oklch(0.68 0.18 65 / 0.15)"
            stroke="oklch(0.68 0.18 65 / 0.3)"
            strokeWidth="0.5"
          />
          {/* Bar stools */}
          {[490, 508, 526, 544, 562].map((bx) => (
            <circle
              key={bx}
              cx={bx}
              cy="100"
              r="5"
              fill="oklch(0.22 0.02 50)"
              stroke="oklch(0.4 0.02 50)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Kitchen area */}
        <g>
          <rect
            x="20"
            y="20"
            width="120"
            height="75"
            rx="8"
            fill="oklch(0.16 0.018 50 / 0.9)"
            stroke="oklch(0.55 0.015 65 / 0.2)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x="80"
            y="52"
            textAnchor="middle"
            fill="oklch(0.55 0.015 65 / 0.6)"
            fontSize="10"
            fontFamily="var(--font-body)"
            letterSpacing="1.5"
          >
            KITCHEN
          </text>
          <text
            x="80"
            y="66"
            textAnchor="middle"
            fill="oklch(0.55 0.015 65 / 0.5)"
            fontSize="9"
            fontFamily="var(--font-body)"
          >
            Staff Only
          </text>
          {/* Kitchen window */}
          <rect
            x="85"
            y="73"
            width="50"
            height="8"
            rx="2"
            fill="oklch(0.68 0.18 65 / 0.12)"
            stroke="oklch(0.68 0.18 65 / 0.25)"
            strokeWidth="0.5"
          />
        </g>

        {/* Private dining area */}
        <g>
          <rect
            x="470"
            y="300"
            width="110"
            height="120"
            rx="8"
            fill="oklch(0.16 0.018 50 / 0.7)"
            stroke="oklch(0.55 0.015 65 / 0.15)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x="525"
            y="352"
            textAnchor="middle"
            fill="oklch(0.55 0.015 65 / 0.5)"
            fontSize="9"
            fontFamily="var(--font-body)"
            letterSpacing="1.5"
          >
            PRIVATE
          </text>
          <text
            x="525"
            y="366"
            textAnchor="middle"
            fill="oklch(0.55 0.015 65 / 0.5)"
            fontSize="9"
            fontFamily="var(--font-body)"
            letterSpacing="1.5"
          >
            DINING
          </text>
        </g>

        {/* Walkway lines */}
        <line
          x1="160"
          y1="100"
          x2="160"
          y2="420"
          stroke="oklch(0.25 0.01 50 / 0.4)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />
        <line
          x1="300"
          y1="100"
          x2="300"
          y2="420"
          stroke="oklch(0.25 0.01 50 / 0.4)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />
        <line
          x1="440"
          y1="100"
          x2="440"
          y2="420"
          stroke="oklch(0.25 0.01 50 / 0.4)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />
        <line
          x1="30"
          y1="200"
          x2="460"
          y2="200"
          stroke="oklch(0.25 0.01 50 / 0.3)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />

        {/* Tables */}
        {tables.map((table, index) => {
          const layout = getLayout(index);
          const isSelected = selectedTableId === table.id;
          const isAvailable = table.status === TableStatus.available;
          const cx = layout.x + layout.w / 2;
          const cy = layout.y + layout.h / 2;
          const isClickable = isAvailable || isSelected;

          return (
            <g
              key={table.id.toString()}
              style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
              onClick={() => isClickable && onSelectTable(table)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                isClickable &&
                onSelectTable(table)
              }
              tabIndex={isClickable ? 0 : -1}
              data-ocid={`floorplan.table.${index + 1}`}
              aria-label={`Table ${Number(table.number)}, seats ${Number(table.capacity)}, ${STATUS_LABEL[table.status]}`}
              aria-pressed={isSelected}
            >
              {/* Selection glow */}
              {isSelected && (
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={layout.w / 2 + 14}
                  ry={layout.h / 2 + 14}
                  fill="url(#selected-glow)"
                />
              )}

              {/* Table rect */}
              <rect
                x={layout.x}
                y={layout.y}
                width={layout.w}
                height={layout.h}
                rx="8"
                fill={STATUS_FILL[table.status]}
                stroke={
                  isSelected
                    ? "oklch(0.68 0.18 65)"
                    : STATUS_STROKE[table.status]
                }
                strokeWidth={isSelected ? 2 : 1}
                filter={isSelected ? "url(#glow-gold)" : undefined}
                style={{
                  transition: "stroke 0.2s, stroke-width 0.2s",
                }}
              />

              {/* Chair dots - top and bottom */}
              {Array.from({ length: Math.min(Number(table.capacity), 4) }).map(
                (_, ci) => {
                  const chairSpacing =
                    layout.w / (Math.min(Number(table.capacity), 4) + 1);
                  const chairX = layout.x + chairSpacing * (ci + 1);
                  const chairKey = `chair-${table.id.toString()}-${ci}`;
                  return (
                    <g key={chairKey}>
                      <circle
                        cx={chairX}
                        cy={layout.y - 6}
                        r="4"
                        fill="oklch(0.22 0.02 50)"
                        stroke="oklch(0.3 0.02 50)"
                        strokeWidth="0.5"
                      />
                      <circle
                        cx={chairX}
                        cy={layout.y + layout.h + 6}
                        r="4"
                        fill="oklch(0.22 0.02 50)"
                        stroke="oklch(0.3 0.02 50)"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                },
              )}

              {/* Table number */}
              <text
                x={cx}
                y={cy - 5}
                textAnchor="middle"
                fill={
                  isSelected
                    ? "oklch(0.68 0.18 65)"
                    : isAvailable
                      ? "oklch(0.82 0.12 65)"
                      : "oklch(0.55 0.01 65)"
                }
                fontSize="13"
                fontWeight="700"
                fontFamily="var(--font-display)"
                style={{ transition: "fill 0.2s" }}
              >
                {Number(table.number)}
              </text>

              {/* Capacity */}
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fill={
                  isSelected
                    ? "oklch(0.68 0.18 65 / 0.7)"
                    : "oklch(0.5 0.01 65 / 0.7)"
                }
                fontSize="9"
                fontFamily="var(--font-body)"
              >
                {Number(table.capacity)} seats
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center justify-center gap-4 mt-4 px-4"
        data-ocid="floorplan.legend"
      >
        {Object.entries(STATUS_LABEL).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                background: STATUS_FILL[status as TableStatus],
                borderColor: STATUS_STROKE[status as TableStatus],
              }}
            />
            <span className="text-xs font-body text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
