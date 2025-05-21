import {
  useCompleteCart,
  useCreatePaymentSession,
  useCreateServiceCart,
  useSelectPaymentSession,
} from "@/api/hooks/cart/mutations";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useMutation } from "@tanstack/react-query";

//[Todo]: Combine It with usePurchaseAd in motors_ad
export const useBuyPropertyAdPlacement = () => {
  const { mutateAsync: createServiceCart } = useCreateServiceCart();
  const { mutateAsync: createPaymentSession } = useCreatePaymentSession();
  const { mutateAsync: completeCart } = useCompleteCart();
  const { mutateAsync: selectPaymentSession } = useSelectPaymentSession();
  return useMutation(
    async (...payload: Parameters<typeof createServiceCart>) => {
      let createdCart = await createServiceCart(...payload);
      if (!createdCart.cart.payment_session) {
        createdCart = await createPaymentSession(createdCart.cart.id);
        const paymentSession = createdCart.cart.payment_sessions.find(
          (session) => session.provider_id === "stripe"
        );
        if (paymentSession) {
          createdCart = await selectPaymentSession({
            cartId: createdCart.cart.id,
            paymentSessionId: "stripe",
          });
        }
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
        defaultBillingDetails:{
          address:{
            country:'AE'
          }
        },
        paymentIntentClientSecret: paymentIntentClientSecret,
      });
      if (initError) throw initError;
      const { error: enteringDataError } = await presentPaymentSheet();
      if (enteringDataError) throw enteringDataError;

      return await completeCart(createdCart.cart.id);
    }
  );
};
