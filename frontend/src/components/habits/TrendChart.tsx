import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function TrendChart({
  data,
}: {
  data: { day: number; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--foreground)"
              stopOpacity={0.25}
            />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <YAxis hide domain={[0, 100]} />
        <Tooltip
          cursor={{ stroke: "var(--border)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(v) => [`${v}%`, "Completion"] as [string, string]}
          labelFormatter={(l) => `Day ${l}`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--foreground)"
          strokeWidth={1.5}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
