// import WarnBanner from "@/feature/product/detail/components/WarnBanner";
import Loader from "@/shared/components/Loader";
import { useProducts } from "@/feature/product/hooks/useProducts";
import { useEffect } from "react";
import { useParams } from "react-router";
import ProductDetail from "./components/ProductDetail";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/shared/store/appStore";

const META_DESCRIPTION_MAX = 155;

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.productId;
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  const { data: products, isLoading, error } = useProducts();
  const product = products?.find((product) => product.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader message={t("common.loading")} />
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="flex items-center w-full justify-center">
        {t("common.somethingWentWrong")}
      </div>
    );
  }
  if (!product)
    return (
      <div className="flex items-center w-full justify-center">
        {t("product.notFound")}
      </div>
    );

  const category = product.product_attributes.find(
    (attribute) => attribute.key === "category",
  );

  const metaTitle = `${product.name[language]} - Hrossabrestur`;
  const fullDescription = product.description[language];
  const metaDescription =
    fullDescription.length > META_DESCRIPTION_MAX
      ? fullDescription.slice(0, META_DESCRIPTION_MAX - 1).trimEnd() + "..."
      : fullDescription;

  return (
    <div>
      <title>{metaTitle}</title>
      <meta name="descritption" content={metaDescription} />
      {/* <WarnBanner />*/}
      <ProductDetail product={product} category={category} key={product.id} />
    </div>
  );
};

export default ProductDetailPage;
