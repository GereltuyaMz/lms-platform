import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import type { Teacher } from "@/types/database/tables";

type InstructorProps = {
  teacher: Teacher | null;
};

export const Instructor = ({ teacher }: InstructorProps) => {
  if (!teacher) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Багш</h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
        {/* Instructor Avatar */}
        <Avatar className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
          <AvatarImage
            src={teacher.avatar_url || undefined}
            alt={teacher.full_name_mn}
          />
          <AvatarFallback className="text-lg md:text-xl bg-gray-200">
            {getInitials(teacher.full_name_mn)}
          </AvatarFallback>
        </Avatar>

        {/* Instructor Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg md:text-xl font-bold">
            {teacher.full_name_mn}
          </h3>

          {teacher.credentials_mn && (
            <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
              {teacher.credentials_mn}
            </p>
          )}

          {teacher.bio_mn && (
            <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line mb-3 md:mb-4">
              {teacher.bio_mn}
            </p>
          )}

          {/* Specializations */}
          {teacher.specialization && teacher.specialization.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 md:gap-2 mt-2 md:mt-3">
              {teacher.specialization.map((spec, index) => (
                <Badge
                  key={index}
                  className="text-xs text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full px-2 py-0.5 w-fit  transition-colors"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
