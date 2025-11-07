import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type CourseBreadcrumbProps = {
  courseTitle: string;
  courseSlug?: string;
  currentPage?: string;
};

export const CourseBreadcrumb = ({
  courseTitle,
  courseSlug,
  currentPage,
}: CourseBreadcrumbProps) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/courses">Courses</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {courseSlug && currentPage ? (
            <BreadcrumbLink asChild>
              <Link href={`/courses/${courseSlug}`}>{courseTitle}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="font-bold">{courseTitle}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {currentPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
