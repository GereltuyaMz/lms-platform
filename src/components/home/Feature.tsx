import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";

export const Feature = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-h2 text-center mb-12 md:mb-16">
          ЭЕШ-д зориулсан манай цогц хөтөлбөрүүд
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =============================== */}
          {/* FEATURED MAIN EESH COURSE CARD */}
          {/* =============================== */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
              Онцлох курс
            </span>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-h3 font-bold mb-3 text-gray-900">
                  ЭЕШ Математикийн Бүрэн Хөтөлбөр
                </h3>

                <p className="text-medium text-gray-700 mb-6 leading-relaxed">
                  ЭЕШ-ын математикийн гол сэдвүүдийг нэг дор цогцоор нь
                  багтаасан хөтөлбөр. Шат дараалсан тайлбар, ойлгомжтой жишээ,
                  практик дасгалуудын тусламжтайгаар алгебр, геометр, тооны
                  онол, статистикийн үндсийг баттай эзэмшинэ.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <FeaturePoint icon="📚" text="100+ хичээл" />
                  <FeaturePoint icon="🧭" text="10 үндсэн курс" />
                  <FeaturePoint icon="✏️" text="Практик дасгал" />
                  <FeaturePoint icon="🎯" text="ЭЕШ стандарт" />
                </div>

                <Link href="/courses">
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 cursor-pointer">
                    Хөтөлбөрийг үзэх
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Image
                src="/assets/math.png"
                alt="Math courses illustration"
                width={380}
                height={300}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>

          {/* =============================== */}
          {/* REFINED CATEGORY CARD */}
          {/* =============================== */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-100 flex flex-col">
            <h4 className="text-h5 font-bold mb-6 text-gray-900">
              Хичээлийн бүлгүүд
            </h4>

            <div className="space-y-6 flex-1">
              <CategoryGroup
                title="📘 Математик"
                items={[
                  "Алгебр",
                  "Геометр",
                  "Тооны онол",
                  "Тохиромж ба статистик",
                ]}
              />

              <CategoryGroup
                title="🔬 Байгалийн ухаан"
                items={["Физик", "Хими"]}
              />

              <CategoryGroup
                title="🌐 Хэл & бичих"
                items={["Англи хэл", "Эссэ бичих"]}
              />
            </div>

            <Link href="/courses" className="mt-6">
              <Button
                variant="outline"
                className="w-full rounded-lg border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer"
              >
                Бүх хөтөлбөрийг үзэх
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* =============================== */}
        {/* XP / GAMIFICATION */}
        {/* =============================== */}
        <div className="mt-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-yellow-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl bg-yellow-500 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="text-h4 font-bold text-gray-900">
                Амжилтаа түвшин ахиулж удирдаарай
              </h4>
              <p className="text-small text-gray-600">
                Суралцах тусам түвшин ахиж, онцгой урамшууллуудыг нээх
                боломжтой.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RewardCard
              icon="📚"
              title="XP оноо авах"
              desc="Хичээл ба тест бүрээс оноо цуглуулна."
            />
            <RewardCard
              icon="🏅"
              title="Тэмдэг нээх"
              desc="Амжилтаараа шинэ badge цуглуулна."
            />
            <RewardCard
              icon="🎁"
              title="Урамшуулал авах"
              desc="Оноогоороо тусгай контент нээх боломжтой."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* Helper Components */

const FeaturePoint = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      <span className="text-sm">{icon}</span>
    </div>
    <span className="text-small text-gray-700">{text}</span>
  </div>
);

const CategoryGroup = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div>
    <h5 className="text-medium font-semibold mb-2 text-gray-800">{title}</h5>
    <ul className="space-y-1 pl-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700 text-small flex gap-2">
          • <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RewardCard = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-4">
      <span className="text-3xl">{icon}</span>
    </div>
    <h5 className="text-h6 font-semibold text-gray-900 mb-1">{title}</h5>
    <p className="text-small text-gray-600">{desc}</p>
  </div>
);
