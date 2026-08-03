import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

const data = [
  { skill: "Communication", value: 80 },
  { skill: "Technical", value: 70 },
  { skill: "Confidence", value: 75 },
  { skill: "Problem Solving", value: 68 },
  { skill: "Accuracy", value: 82 }
];

export default function SkillRadarChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400">No skill data yet</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Skill-wise Progress
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar
            dataKey="value"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
