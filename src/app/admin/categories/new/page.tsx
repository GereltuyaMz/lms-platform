import { getParentCategories } from "@/lib/actions/admin/categories";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export default async function NewCategoryPage() {
  const parentCategories = await getParentCategories();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Category</h1>
        <p className="text-gray-500 mt-1">Create a new category for courses</p>
      </div>

      <CategoryForm parentCategories={parentCategories} />
    </div>
  );
}
