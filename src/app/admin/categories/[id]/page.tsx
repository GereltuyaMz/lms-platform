import { notFound } from "next/navigation";
import {
  getCategory,
  getParentCategories,
} from "@/lib/actions/admin/categories";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { CategoryEditWrapper } from "@/components/admin/categories/CategoryEditWrapper";

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
      <CategoryEditWrapper categoryName={null}>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Шинэ ангилал</h1>
            <p className="text-gray-500 mt-1">Хичээлд зориулсан шинэ ангилал үүсгэх</p>
          </div>
          <CategoryForm parentCategories={parentCategories} />
        </div>
      </CategoryEditWrapper>
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
  const categoryDisplayName = category.name;

  return (
    <CategoryEditWrapper categoryName={categoryDisplayName}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ангилал засах</h1>
          <p className="text-gray-500 mt-1">{categoryDisplayName}-г шинэчлэх</p>
        </div>

        <CategoryForm category={category} parentCategories={filteredParents} />
      </div>
    </CategoryEditWrapper>
  );
}
