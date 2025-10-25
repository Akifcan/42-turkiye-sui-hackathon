import { useCurrentAccount } from "@mysten/dapp-kit";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
