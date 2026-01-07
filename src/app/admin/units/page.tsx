import { getCoursesWithUnitSummary } from "@/lib/actions/admin/units";
import { UnitsAccordionTable } from "@/components/admin/units/UnitsAccordionTable";

export default async function UnitsPage() {
  const { courses } = await getCoursesWithUnitSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Бүлгүүд</h1>
        <p className="text-gray-500 mt-1">
          Хичээлээр бүлэглэсэн бүлгүүдийг харах
        </p>
      </div>

      <UnitsAccordionTable courses={courses} />
    </div>
  );
}
