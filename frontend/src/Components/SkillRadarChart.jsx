import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function SkillRadarChart({ report }) {
  const data = [
    { skill: "Accuracy", value: report.averageAccuracy || 0 },
    { skill: "Relevance", value: report.averageRelevance || 0 },
    { skill: "Communication", value: report.averageCommunication || 0 },
    { skill: "Confidence", value: report.averageConfidence || 0 },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow">
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">
        🧠 Skill Radar Analysis
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="#c7d2fe" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#4338ca", fontSize: 13, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />

          {/* Outer glow */}
          <Radar
            dataKey="value"
            stroke="#6366f1"
            fill="#818cf8"
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
