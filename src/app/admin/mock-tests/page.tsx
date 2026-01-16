import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockTestTable } from "@/components/admin/mock-tests/MockTestTable";
import { getMockTests } from "@/lib/actions/admin/mock-tests";

export default async function MockTestsPage() {
  const tests = await getMockTests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Элсэлтийн шалгалт
          </h1>
          <p className="text-gray-600 mt-1">
            Шалгалтын бүх асуултуудыг удирдах
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/mock-tests/new">
            <Plus className="h-4 w-4 mr-2" />
            Шинэ шалгалт
          </Link>
        </Button>
      </div>

      <MockTestTable tests={tests} />
    </div>
  );
}
