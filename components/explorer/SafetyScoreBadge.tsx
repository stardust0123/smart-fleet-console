interface Props {
  score: number;
}

export default function SafetyScoreBadge({
  score,
}: Props) {

  let text = "";
  let color = "";

  if (score >= 90) {
    text = "Excellent";
    color =
      "bg-green-100 text-green-700";
  }

  else if (score >= 75) {
    text = "Good";
    color =
      "bg-blue-100 text-blue-700";
  }

  else if (score >= 60) {
    text = "Warning";
    color =
      "bg-yellow-100 text-yellow-700";
  }

  else {
    text = "High Risk";
    color =
      "bg-red-100 text-red-700";
  }

  return (

    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}
    >
      {text}
    </span>

  );

}