"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const { toast } = useToast();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		console.log("Form submitted:", formData);
		
		setFormData({ name: "", email: "", message: "" });
		toast({
			title: "Message sent!",
			description:
				"Thank you for your message. I'll get back to you soon.",
		});
	};

	return (
		<section id="contact" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex text-slate-900 dark:text-slate-100">
				Contact Me
			</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-6 max-w-md mx-auto shadow-sm bg-white dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-800 rounded-lg"
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
				<div className="flex justify-center md:justify-end">
					<Button type="submit">Send Message</Button>
				</div>
			</form>
		</section>
	);
}
