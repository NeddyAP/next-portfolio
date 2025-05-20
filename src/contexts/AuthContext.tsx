"use client";

import React, {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js"; // Added AuthChangeEvent
import { supabaseBrowserClient as supabase } from "@/lib/supabaseClient"; // Renamed import

interface AuthContextType {
	session: Session | null;
	user: User | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session: currentSession },
			} = await supabase.auth.getSession();
			setSession(currentSession);
			setUser(currentSession?.user ?? null);
			setIsLoading(false);
		};

		getSession();

const {
data: { subscription },
} = supabase.auth.onAuthStateChange(
(event: AuthChangeEvent, session: Session | null) => {
setSession(session);
setUser(session?.user ?? null);
			// If loading was true and we get a session or null, it means initial load is done.
			if (isLoading) setIsLoading(false);
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [isLoading]); // Added isLoading to dependency array to ensure getSession runs once after initial load.

	const signOut = async () => {
		await supabase.auth.signOut();
		// State will be updated by onAuthStateChange listener
	};

	const value = {
		session,
		user,
		isLoading,
		signOut,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
