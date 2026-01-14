import Link from "next/link";
import { GraduationCapIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export const EmptyCoursesState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border">
      <GraduationCapIcon size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Та одоогоор хичээлд бүртгүүлээгүй байна
      </h3>
      <p className="text-gray-600 mb-6">
        Хичээлүүдийг судалж, өөрт тохирох хичээлээ олоорой!
      </p>
      <Button asChild variant="landing">
        <Link href="/courses">Хичээлүүдийг үзэх</Link>
      </Button>
    </div>
  );
};
