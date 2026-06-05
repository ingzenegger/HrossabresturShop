import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
};

const Tooltip = ({ label, children }: TooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-fit px-3 py-1 text-sm">
        {label}
      </HoverCardContent>
    </HoverCard>
  );
};

export default Tooltip;
