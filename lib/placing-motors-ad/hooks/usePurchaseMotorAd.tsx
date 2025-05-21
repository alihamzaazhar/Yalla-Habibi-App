import {
  useCompleteCart,
  useCreatePaymentSession,
  useSelectPaymentSession,
  useUpdateCart,
} from "@/api/hooks/cart/mutations";
import {
  useCreateCartForBuyingAd,
  useCreateCartForDigitalProduct,
} from "@/api/hooks/vendor/mutations";
import { StoreCartsRes } from "@medusajs/medusa";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useMutation } from "@tanstack/react-query";

interface Payload {
  variants: Array<{
    variant_id: string;
    metadata: Record<string, unknown>;
  }>;
}
export const usePurchaseMotorAd = () => {
  const { mutateAsync: createPaymentSession } = useCreatePaymentSession();
  const { mutateAsync: createDigitalCart } = useCreateCartForDigitalProduct();
  const { mutateAsync: completeCart } = useCompleteCart();
  const { mutateAsync: updateCart } = useUpdateCart();
  const { mutateAsync: selectPaymentSession } = useSelectPaymentSession();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      let { variants } = payload;
      let createdCart = await createDigitalCart({
        items: variants.map((v) => ({
          variant_id: v.variant_id,
          metadata: v.metadata,
          quantity: 1,
        })),
      });
      const cartId = createdCart.cart.id;
      createdCart = await createPaymentSession(cartId);
      const paymentSession = createdCart.cart.payment_sessions.find(
        (session) => session.provider_id === "stripe"
      );
      if (paymentSession) {
        createdCart = await selectPaymentSession({
          cartId: cartId,
          paymentSessionId: "stripe",
        });
      }
      if (
        !createdCart.cart.payment_session ||
        createdCart.cart.payment_session.provider_id !== "stripe" ||
        !createdCart.cart.payment_session.data.client_secret
      ) {
        throw new Error("Stripe Payment session not available");
      }

      const paymentIntentClientSecret = createdCart.cart.payment_session.data
        .client_secret as string;
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Yallah Dubai",
        defaultBillingDetails: {
          address: {
            country: "AE",
          },
        },
        paymentIntentClientSecret: paymentIntentClientSecret,
      });
      if (initError) throw initError;
      const { error: enteringDataError } = await presentPaymentSheet();
      if (enteringDataError) throw enteringDataError;
      return await completeCart(createdCart.cart.id);
    },
  });
};
