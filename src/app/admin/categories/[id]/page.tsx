import { notFound } from "next/navigation";
import {
  getCategory,
  getParentCategories,
} from "@/lib/actions/admin/categories";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  // Handle "new" as a separate route
  if (id === "new") {
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

  const [category, parentCategories] = await Promise.all([
    getCategory(id),
    getParentCategories(),
  ]);

  if (!category) {
    notFound();
  }

  // Filter out self from parent options
  const filteredParents = parentCategories.filter((p) => p.id !== category.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
        <p className="text-gray-500 mt-1">
          Update {category.name_mn || category.name}
        </p>
      </div>

      <CategoryForm category={category} parentCategories={filteredParents} />
    </div>
  );
}
