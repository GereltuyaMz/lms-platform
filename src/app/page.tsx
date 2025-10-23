import {
  Hero,
  WhyChooseUs,
  PersonalizedLearning,
  Motivated,
  Feature,
  LearnAnytime,
} from "@/components/home";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyChooseUs />
      <PersonalizedLearning />
      <Motivated />
      <Feature />
      <LearnAnytime />
    </div>
  );
}
