import type { ProductAsset, ProductVariant } from "@/shared/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { cn } from "@/shared/lib/utils";

type Props = {
  assets: ProductAsset[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  setSelectedVariant: (variant: ProductVariant) => void;
};

const ProductImageCarousel = ({
  assets,
  variants,
  selectedVariant,
  setSelectedVariant,
}: Props) => {
  const mainImage = assets.find(
    (asset) => asset.variant_id === selectedVariant.id,
  );

  // Only show thumbnails for assets that are linked to a variant
  const variantAssets = assets.filter((asset) => asset.variant_id !== null);

  function handleThumbnailClick(asset: ProductAsset) {
    const matchingVariant = variants.find((v) => v.id === asset.variant_id);
    if (!matchingVariant) return;
    setSelectedVariant(matchingVariant);
  }

  return (
    <div className="flex flex-col gap-3 max-w-120 px-8 m-3">
      {/* Main image */}
      <img
        src={mainImage?.asset_url}
        alt={mainImage?.alt_text ?? ""}
        className="w-full rounded-md object-cover aspect-square"
      />

      {/* Thumbnail carousel — only renders if there are variant-linked assets */}
      {variantAssets.length > 0 && (
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {variantAssets.map((asset) => (
              <CarouselItem key={asset.id} className="basis-1/3">
                <button
                  onClick={() => handleThumbnailClick(asset)}
                  className={cn(
                    "w-full rounded-md overflow-hidden border-2 transition-colors cursor-pointer",
                    asset.variant_id === selectedVariant.id
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground",
                  )}
                >
                  <img
                    src={asset.asset_url}
                    alt={asset.alt_text}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {variantAssets.length > 3 && (
            <>
              <CarouselPrevious className="-left-8" />
              <CarouselNext className="-right-8" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default ProductImageCarousel;
