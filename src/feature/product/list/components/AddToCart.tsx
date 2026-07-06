import { Button } from "@/shared/components/ui/button";
import { useAppStore } from "@/shared/store/appStore";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

type props = {
  btnLabel?: string;
  productId: string;
  variantId: string;
};

const AddToCart = ({ btnLabel = "Add", productId, variantId }: props) => {
  const handleAddToCart = useAppStore((state) => state.handleAddToCart);
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      {user ? (
        <Button
          onClick={() => handleAddToCart?.(productId, variantId)}
          className="cursor-pointer"
        >
          {btnLabel}
        </Button>
      ) : (
        <Button className="cursor-pointer" onClick={() => navigate("/login")}>
          {t("product.logInToAdd")}
        </Button>
      )}
    </>
  );
};

export default AddToCart;
