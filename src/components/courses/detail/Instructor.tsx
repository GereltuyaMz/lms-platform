import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "@/icons";

export const Instructor = () => {
  const instructor = {
    name: "David Easdown",
    avatar: undefined,
    students: 1000,
    bio: 'Math class was always so frustrating.\nI\'d go to a class, spend hours on homework, and three days later have an "Ah-ha!" moment about how the problems worked that could have slashed my homework time in half.',
    linkedin: "#",
    instagram: "#",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Instructor</h2>

      <div className="flex items-start gap-4">
        {/* Instructor Avatar */}
        <Avatar className="h-20 w-20 flex-shrink-0">
          <AvatarImage src={instructor.avatar} alt={instructor.name} />
          <AvatarFallback className="text-xl bg-gray-200">
            {getInitials(instructor.name)}
          </AvatarFallback>
        </Avatar>

        {/* Instructor Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{instructor.name}</h3>

          <p className="text-sm text-muted-foreground mb-3">
            {instructor.students.toLocaleString()} Students
          </p>

          <p className="text-regular text-muted-foreground whitespace-pre-line mb-4">
            {instructor.bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href={instructor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon width={24} height={24} fill="#3B82F6" />
            </a>
            <a
              href={instructor.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon width={24} height={24} fill="#3B82F6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
