import Link from "next/link"
import { Button } from "@/components/ui/button"

export const EmptyCoursesState = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-3xl">📚</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Та одоогоор хичээлд бүртгүүлээгүй байна
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Хичээлүүдийг судалж, өөрт тохирох хичээлээ олоорой!
      </p>
      <Link href="/courses">
        <Button className="cursor-pointer px-6">
          Хичээлүүдийг үзэх
        </Button>
      </Link>
    </div>
  )
}
