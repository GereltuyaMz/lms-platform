import { notFound } from "next/navigation";
import { MockTestForm } from "@/components/admin/mock-tests/MockTestForm";
import { getMockTest } from "@/lib/actions/admin/mock-tests";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMockTestPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getMockTest(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const mockTest = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Шалгалт засах
        </h1>
        <p className="text-gray-600 mt-1">
          {mockTest.title}
        </p>
      </div>

      <MockTestForm mockTest={mockTest} />
    </div>
  );
}
