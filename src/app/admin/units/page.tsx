import { getCoursesWithUnitSummary } from "@/lib/actions/admin/units";
import { UnitsAccordionTable } from "@/components/admin/units/UnitsAccordionTable";

type UnitsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const { courses, currentPage, totalPages } =
    await getCoursesWithUnitSummary(page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Бүлгүүд</h1>
        <p className="text-gray-500 mt-1">
          Хичээлээр бүлэглэсэн бүлгүүдийг харах
        </p>
      </div>

      <UnitsAccordionTable
        courses={courses}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
