import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <h2 className="text-2xl font-bold mb-6">Багш</h2>

      <div className="flex items-start gap-4">
        {/* Instructor Avatar */}
        <Avatar className="h-20 w-20 flex-shrink-0">
          <AvatarImage src={teacher.avatar_url || undefined} alt={teacher.full_name_mn} />
          <AvatarFallback className="text-xl bg-gray-200">
            {getInitials(teacher.full_name_mn)}
          </AvatarFallback>
        </Avatar>

        {/* Instructor Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{teacher.full_name_mn}</h3>

          {teacher.credentials_mn && (
            <p className="text-sm text-muted-foreground mb-3">
              {teacher.credentials_mn}
            </p>
          )}

          {teacher.bio_mn && (
            <p className="text-regular text-muted-foreground whitespace-pre-line mb-4">
              {teacher.bio_mn}
            </p>
          )}

          {/* Specializations */}
          {teacher.specialization && teacher.specialization.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {teacher.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
