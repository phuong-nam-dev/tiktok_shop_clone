"use client";

import React, { createContext, useContext } from "react";

export interface AuthContextType {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  setUser: (user: AuthContextType["user"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: AuthContextType["user"];
}) => {
  const [currentUser, setCurrentUser] = React.useState<AuthContextType["user"]>(
    user || null
  );

  const value: AuthContextType = {
    user: currentUser,
    setUser: setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return authContext;
};

export { AuthProvider, useAuthContext };
