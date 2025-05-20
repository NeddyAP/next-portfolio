"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ArrowUp, ArrowDown } from "lucide-react";

export interface Tool {
	name: string;
	icon_name?: string;
	order: number;
}

interface EditToolsFormProps {
	currentTools: Tool[] | null;
	onSave: (newTools: Tool[]) => void;
	onCancel: () => void;
}

export default function EditToolsForm({
	currentTools,
	onSave,
	onCancel,
}: EditToolsFormProps) {
	const [tools, setTools] = useState<Tool[]>([]);
	const [newToolName, setNewToolName] = useState("");

	const [newToolIcon, setNewToolIcon] = useState("");

	useEffect(() => {
		if (currentTools && Array.isArray(currentTools)) {
			const processedTools = currentTools
				.map((t, index) => ({
					name: t.name,
					icon_name: t.icon_name,
					order: typeof t.order === "number" ? t.order : index,
				}))
				.sort((a, b) => a.order - b.order); // Sort by order
			setTools(processedTools);
		} else {
			setTools([]);
		}
	}, [currentTools]);

	const handleAddTool = () => {
		const trimmedName = newToolName.trim();
		const trimmedIcon = newToolIcon.trim();

		if (trimmedName && !tools.some((tool) => tool.name === trimmedName)) {
			const newToolToAdd: Tool = {
				name: trimmedName,
				order: tools.length, // Assign order
			};
			if (trimmedIcon) {
				newToolToAdd.icon_name = trimmedIcon;
			}
			setTools([...tools, newToolToAdd]);
			setNewToolName("");
			setNewToolIcon("");
		}
	};

	const reorderTools = (newTools: Tool[]) => {
		return newTools.map((tool, index) => ({ ...tool, order: index }));
	};

	const handleRemoveTool = (toolOrderToRemove: number) => {
		const updatedTools = tools.filter(
			(tool) => tool.order !== toolOrderToRemove
		);
		setTools(reorderTools(updatedTools));
	};

	const handleMoveTool = (currentIndex: number, direction: "up" | "down") => {
		const newTools = [...tools];
		const targetIndex =
			direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (targetIndex < 0 || targetIndex >= newTools.length) {
			return; // Invalid move
		}

		// Swap elements
		const temp = newTools[currentIndex];
		newTools[currentIndex] = newTools[targetIndex];
		newTools[targetIndex] = temp;

		setTools(reorderTools(newTools));
	};

	const handleSaveChanges = () => {
		onSave(tools);
	};

	return (
		<div className="space-y-4 p-1">
			<div className="flex flex-col gap-4">
				<div>
					<Label htmlFor="newToolNameInput">Tool Name</Label>
					<Input
						id="newToolNameInput"
						type="text"
						value={newToolName}
						onChange={(e) => setNewToolName(e.target.value)}
						placeholder="Enter tool name (e.g., VS Code)"
						className="mt-1"
					/>
				</div>
				{/* Category input section removed */}
				<div>
					<Label htmlFor="newToolIconInput">
						Icon Name (Optional)
					</Label>
					<Input
						id="newToolIconInput"
						type="text"
						value={newToolIcon}
						onChange={(e) => setNewToolIcon(e.target.value)}
						placeholder="Enter icon name (e.g., Vscode)"
						className="mt-1"
					/>
				</div>
			</div>
			<Button
				type="button"
				onClick={handleAddTool}
				variant="outline"
				className="w-full sm:w-auto"
				disabled={!newToolName.trim()}
			>
				Add Tool
			</Button>

			{tools.length > 0 && (
				<div className="space-y-2">
					<Label>Current Tools:</Label>
					<ul className="space-y-1">
						{tools.map((tool, index) => (
							<li
								key={tool.order} // Use tool.order as key
								className="flex items-center justify-between p-2 border rounded-md"
							>
								<div className="flex-grow">
									<span className="font-medium">
										{tool.name}
									</span>
									{tool.icon_name && (
										<span className="text-xs text-muted-foreground ml-2">
											(Icon: {tool.icon_name})
										</span>
									)}
								</div>
								<div className="flex items-center space-x-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleMoveTool(index, "up")
										}
										disabled={index === 0}
										aria-label={`Move ${tool.name} up`}
									>
										<ArrowUp className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleMoveTool(index, "down")
										}
										disabled={index === tools.length - 1}
										aria-label={`Move ${tool.name} down`}
									>
										<ArrowDown className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											handleRemoveTool(tool.order)
										}
										aria-label={`Remove ${tool.name}`}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
			{tools.length === 0 && (
				<p className="text-sm text-muted-foreground">
					No tools added yet.
				</p>
			)}

			<div className="flex justify-end space-x-2 pt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="button" onClick={handleSaveChanges}>
					Save Tools
				</Button>
			</div>
		</div>
	);
}
