import Link from "next/link";
import { Calculator, Atom, TestTube, Languages } from "lucide-react";
import type { CategoryInfo } from "@/types/mock-test";

const categories: CategoryInfo[] = [
  {
    id: "math",
    title: "Математик",
    description: "Алгебр, геометр, тооны систем",
    color: "blue",
  },
  {
    id: "physics",
    title: "Физик",
    description: "Механик, хүч, энерги, цахилгаан",
    color: "purple",
  },
  {
    id: "chemistry",
    title: "Хими",
    description: "Атом, молекул, урвал, хүчил-суурь",
    color: "green",
  },
  {
    id: "english",
    title: "Англи хэл",
    description: "Дүрэм, үг, уншлага, угтвар",
    color: "orange",
  },
];

const categoryIcons = {
  math: Calculator,
  physics: Atom,
  chemistry: TestTube,
  english: Languages,
};

type ColorScheme = {
  bg: string;
  border: string;
  text: string;
  icon: string;
  hover: string;
};

const categoryColors: Record<string, ColorScheme> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    icon: "text-blue-600",
    hover: "hover:bg-blue-100",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-900",
    icon: "text-purple-600",
    hover: "hover:bg-purple-100",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-900",
    icon: "text-green-600",
    hover: "hover:bg-green-100",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-900",
    icon: "text-orange-600",
    hover: "hover:bg-orange-100",
  },
};

export default function MockTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ЭЕШ Жишээ Шалгалтууд
          </h1>
          <p className="text-gray-600">
            Бодит шалгалттай адилхан нөхцөлд дадлага хий. Хичээл сонгоод эхэл.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            const colors = categoryColors[category.color];

            return (
              <Link
                key={category.id}
                href={`/mock-test/${category.id}`}
                className={`block p-6 rounded-lg border-2 transition-all cursor-pointer ${colors.bg} ${colors.border} ${colors.hover}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-white ${colors.border} border`}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-2xl font-bold mb-2 ${colors.text}`}>
                      {category.title}
                    </h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-3">Тестийн тухай</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Хичээл бүр 9 асуулттай, 45 минутын хугацаатай</li>
            <li>• Асуултууд бодит ЭЕШ-ийн хэлбэртэй адилхан</li>
            <li>• Хариултууд автоматаар хадгалагдана</li>
            <li>• Тестээ дахин өгч үр дүнгээ сайжруулах боломжтой</li>
            <li>• Амжилттай үр дүнгээр XP цуглуул</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
