"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ArrowUp, ArrowDown } from "lucide-react";

export interface Skill {
	name: string;
	icon_name?: string;
	order: number;
}

interface EditSkillsetFormProps {
	currentSkillset: Skill[] | null;
	onSave: (newSkillset: Skill[]) => void;
	onCancel: () => void;
}

export default function EditSkillsetForm({
	currentSkillset,
	onSave,
	onCancel,
}: EditSkillsetFormProps) {
	const [skillset, setSkillset] = useState<Skill[]>([]);
	const [newSkillName, setNewSkillName] = useState("");

	const [newSkillIcon, setNewSkillIcon] = useState("");

	useEffect(() => {
		if (currentSkillset && Array.isArray(currentSkillset)) {
			const processedSkillset = currentSkillset
				.map((s, index) => ({
					name: s.name,
					icon_name: s.icon_name,
					order: typeof s.order === "number" ? s.order : index,
				}))
				.sort((a, b) => a.order - b.order); // Sort by order
			setSkillset(processedSkillset);
		} else {
			setSkillset([]);
		}
	}, [currentSkillset]);

	const handleAddSkill = () => {
		const trimmedName = newSkillName.trim();
		const trimmedIcon = newSkillIcon.trim();

		if (
			trimmedName &&
			!skillset.some((skill) => skill.name === trimmedName)
		) {
			const newSkillToAdd: Skill = {
				name: trimmedName,
				order: skillset.length, // Assign order
			};
			if (trimmedIcon) {
				newSkillToAdd.icon_name = trimmedIcon;
			}
			setSkillset([...skillset, newSkillToAdd]);
			setNewSkillName("");
			setNewSkillIcon("");
		}
	};

	const reorderSkillset = (newSkillset: Skill[]) => {
		return newSkillset.map((skill, index) => ({ ...skill, order: index }));
	};

	const handleRemoveSkill = (skillOrderToRemove: number) => {
		const updatedSkillset = skillset.filter(
			(skill) => skill.order !== skillOrderToRemove
		);
		setSkillset(reorderSkillset(updatedSkillset));
	};

	const handleMoveSkill = (
		currentIndex: number,
		direction: "up" | "down"
	) => {
		const newSkillset = [...skillset];
		const targetIndex =
			direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (targetIndex < 0 || targetIndex >= newSkillset.length) {
			return; // Invalid move
		}

		// Swap elements
		const temp = newSkillset[currentIndex];
		newSkillset[currentIndex] = newSkillset[targetIndex];
		newSkillset[targetIndex] = temp;

		setSkillset(reorderSkillset(newSkillset));
	};

	const handleSaveChanges = () => {
		onSave(skillset);
	};

	return (
		<div className="space-y-4 p-1">
			<div className="flex flex-col gap-4">
				<div>
					<Label htmlFor="newSkillNameInput">Skill Name</Label>
					<Input
						id="newSkillNameInput"
						type="text"
						value={newSkillName}
						onChange={(e) => setNewSkillName(e.target.value)}
						placeholder="Enter skill name (e.g., JavaScript)"
						className="mt-1"
					/>
				</div>
				{/* Proficiency input section removed */}
				<div>
					<Label htmlFor="newSkillIconInput">
						Icon Name (Optional)
					</Label>
					<Input
						id="newSkillIconInput"
						type="text"
						value={newSkillIcon}
						onChange={(e) => setNewSkillIcon(e.target.value)}
						placeholder="Enter icon name (e.g., Javascript)"
						className="mt-1"
					/>
				</div>
			</div>
			<Button
				type="button"
				onClick={handleAddSkill}
				variant="outline"
				className="w-full sm:w-auto"
				disabled={!newSkillName.trim()}
			>
				Add Skill
			</Button>

			{skillset.length > 0 && (
				<div className="space-y-2">
					<Label>Current Skills:</Label>
					<ul className="space-y-1">
						{skillset.map((skill, index) => (
							<li
								key={skill.order} // Use skill.order as key if it's guaranteed unique and stable after reorder
								className="flex items-center justify-between p-2 border rounded-md"
							>
								<div className="flex-grow">
									<span className="font-medium">
										{skill.name}
									</span>
									{skill.icon_name && (
										<span className="text-xs text-muted-foreground ml-2">
											(Icon: {skill.icon_name})
										</span>
									)}
								</div>
								<div className="flex items-center space-x-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleMoveSkill(index, "up")
										}
										disabled={index === 0}
										aria-label={`Move ${skill.name} up`}
									>
										<ArrowUp className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleMoveSkill(index, "down")
										}
										disabled={index === skillset.length - 1}
										aria-label={`Move ${skill.name} down`}
									>
										<ArrowDown className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleRemoveSkill(skill.order)
										}
										aria-label={`Remove ${skill.name}`}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
			{skillset.length === 0 && (
				<p className="text-sm text-muted-foreground">
					No skills added yet.
				</p>
			)}

			<div className="flex justify-end space-x-2 pt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="button" onClick={handleSaveChanges}>
					Save Skillset
				</Button>
			</div>
		</div>
	);
}
