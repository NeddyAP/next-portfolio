"use client";

import { useEffect, useState } from "react";

export default function SpaceBackground({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <>{children}</>;  
	}

	return (
		<>
			<div className="fixed inset-0 overflow-hidden -z-10">
				<div className="stars-small w-full h-full absolute" />
				<div className="stars-medium w-full h-full absolute" />
				<div className="stars-large w-full h-full absolute" />
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-transparent" />
				<div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
			</div>
			{children}
		</>
	);
}
