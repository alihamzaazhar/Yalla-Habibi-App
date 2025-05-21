import {
  useCompleteCart,
  useCreatePaymentSession,
  useSelectPaymentSession,
  useUpdateCart,
  useUpdateCartDetails,
} from "@/api/hooks/cart/mutations";
import { useCreateCartForBuyingAd } from "@/api/hooks/vendor/carts/mutations";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useMutation } from "@tanstack/react-query";

interface Payload {
  id: string;
  email?: string;
}
export const useCompleteCartWithStripe = () => {
  const { mutateAsync: createPaymentSession } = useCreatePaymentSession();
  const { mutateAsync: completeCart } = useCompleteCart();
  const { mutateAsync: updateCart } = useUpdateCartDetails();
  const { mutateAsync: selectPaymentSession } = useSelectPaymentSession();
  return useMutation({
    mutationFn: async (cart: Payload) => {
      let updatedCart = null;
      if (cart.email) {
        updatedCart = await updateCart({
          id: cart.id,
          email: cart.email,
        });
      }
      updatedCart = await createPaymentSession(cart.id);
      const paymentSession = updatedCart.cart.payment_sessions.find(
        (session) => session.provider_id === "stripe"
      );
      if (paymentSession) {
        updatedCart = await selectPaymentSession({
          cartId: updatedCart.cart.id,
          paymentSessionId: "stripe",
        });
      }
      if (
        !updatedCart.cart.payment_session ||
        updatedCart.cart.payment_session.provider_id !== "stripe" ||
        !updatedCart.cart.payment_session.data.client_secret
      ) {
        throw new Error("Stripe Payment session not available");
      }

      const paymentIntentClientSecret = updatedCart.cart.payment_session.data
        .client_secret as string;
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Yallah Dubai",
        paymentIntentClientSecret: paymentIntentClientSecret,
      });
      if (initError) throw initError;
      const { error: enteringDataError } = await presentPaymentSheet();
      if (enteringDataError) throw enteringDataError;
      return await completeCart(updatedCart.cart.id);
    },
  });
};
