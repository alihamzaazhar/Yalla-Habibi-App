import createGenericContext from "@/lib/common/create-generic-context";
import { type PropsWithChildren } from "react";
import Client from "./axios-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import useFocusManagerAppStateAware from "@/lib/hooks/useFocusManagerAppStateAware";


interface ApiContext {
  client: Client;
}
type Props = PropsWithChildren<Partial<ApiContext> & { baseUrl: string }>;
const [useYallahApiContext, ApiContextProvider] = createGenericContext<ApiContext>();

const queryClient = new QueryClient();
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});


function YallahApiProvider({
  baseUrl,
  children,
  client = new Client({
    baseUrl,
    maxRetries: 3,
  }),
}: Props) {
  useReactQueryDevTools(queryClient);
  useFocusManagerAppStateAware()
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContextProvider value={{ client }}>{children}</ApiContextProvider>
    </QueryClientProvider>
  );
}

export { useYallahApiContext, YallahApiProvider };
