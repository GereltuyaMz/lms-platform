import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoriesWithHierarchy } from "@/lib/actions/admin/categories";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithHierarchy();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ангилал</h1>
          <p className="text-gray-500 mt-1">
            Шалгалтын төрөл болон хичээлийн ангилалыг удирдах
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Ангилал нэмэх
          </Link>
        </Button>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
