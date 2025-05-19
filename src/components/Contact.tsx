"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "@emailjs/browser";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/types/supabase";

const isValidEmail = (email: string) => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return emailRegex.test(email);
};

// Define props for the component
interface AboutMeProps {
	aboutData: Database["public"]["Tables"]["about_me"]["Row"] | null;
}

export default function Contact({ aboutData }: AboutMeProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
	}, []);

	useEffect(() => {
		if (cooldown > 0) {
			const timer = setTimeout(() => {
				setCooldown(cooldown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [cooldown]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isValidEmail(formData.email)) {
			toast({
				variant: "destructive",
				title: "Invalid Email",
				description: "Please enter a valid email address",
				className:
					"bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800",
			});
			return;
		}

		if (cooldown > 0) {
			toast({
				variant: "destructive",
				title: "Please wait",
				description: `You can send another message in ${cooldown} seconds`,
				className: "bg-white dark:bg-slate-950",
			});
			return;
		}

		setIsLoading(true);
		try {
			await emailjs.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
				{
					from_name: formData.name,
					from_email: formData.email,
					message: formData.message,
				}
			);

			setFormData({ name: "", email: "", message: "" });
			setCooldown(60);
			toast({
				variant: "default",
				title: "✅ Success!",
				description:
					"Thank you for your message. I'll get back to you soon.",
				className:
					"bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800",
			});
		} catch (error) {
			console.error("Error sending email:", error);
			toast({
				variant: "destructive",
				title: "❌ Error",
				description: "Failed to send message. Please try again later.",
				className:
					"bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const getButtonText = () => {
		if (isLoading) return "Sending...";
		if (cooldown > 0) return `Wait ${cooldown}s`;
		return "Send Message";
	};

	return (
		<section id="contact" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex text-slate-900 dark:text-slate-100">
				Contact Me
			</h2>
			{/* Two-column layout container */}
			<div className="flex flex-col md:flex-row gap-8 lg:gap-12 max-w-4xl mx-auto">
				{/* Left Column: Contact Info */}
				<div className="md:w-1/3 space-y-4">
					<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
						Get in Touch
					</h3>
					<p className="text-slate-600 dark:text-slate-400">
						Feel free to reach out directly via email or phone.
					</p>
					<div className="space-y-2">
						<p className="text-slate-600 dark:text-slate-400">
							<strong>Email:</strong>{" "}
							<a
								href={`mailto:${
									aboutData?.contact_email ||
									"neddy.prasetio@gmail.com"
								}`}
								className="underline hover:text-slate-900 dark:hover:text-slate-100"
							>
								{aboutData?.contact_email ||
									"neddy.prasetio@gmail.com"}
							</a>
						</p>
						<p className="text-slate-600 dark:text-slate-400">
							<strong>Phone:</strong>{" "}
							<a
								href="tel:+6282125241014"
								className="underline hover:text-slate-900 dark:hover:text-slate-100"
							>
								+62 821-2524-1014
							</a>
						</p>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						Alternatively, use the form to send me a message.
					</p>
				</div>

				{/* Right Column: Contact Form */}
				<div className="md:w-2/3">
					<form
						onSubmit={handleSubmit}
						className="space-y-6 shadow-sm bg-white dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-800 rounded-lg"
					>
						<div className="space-y-2">
							<label
								htmlFor="name"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100"
							>
								Name
							</label>
							<Input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100"
							>
								Email
							</label>
							<Input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="message"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100"
							>
								Message
							</label>
							<Textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isLoading || cooldown > 0}
								className={`min-w-[150px] ${
									cooldown > 0 ? "bg-gray-500" : ""
								}`}
							>
								{getButtonText()}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
