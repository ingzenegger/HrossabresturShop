import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item";
import { Spinner } from "./ui/spinner";

type props = {
  message: string;
  variant?: "muted" | "default" | "outline" | null | undefined;
};

const Loader = ({ message, variant = "default" }: props) => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant={variant}>
        <ItemMedia>
          <Spinner className="size-6" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{message}</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
};

export default Loader;
