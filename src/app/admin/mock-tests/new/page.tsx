import { MockTestForm } from "@/components/admin/mock-tests/MockTestForm";

export default function NewMockTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Шинэ элсэлтийн шалгалт үүсгэх
        </h1>
        <p className="text-gray-600 mt-1">
          Шалгалтын мэдээлэл, хэсэг, асуулт, хариултуудыг нэмнэ үү
        </p>
      </div>

      <MockTestForm />
    </div>
  );
}
