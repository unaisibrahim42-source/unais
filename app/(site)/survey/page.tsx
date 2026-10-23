import type { Metadata } from "next";
import GrowSurvey from "@/components/GrowSurvey";

export const metadata: Metadata = {
  title: "Grow With Elevate | Elevate Creative Media",
  description:
    "Tell us about your brand and what you need — we'll put together a growth plan built around it.",
};

export default function SurveyPage() {
  return <GrowSurvey />;
}
