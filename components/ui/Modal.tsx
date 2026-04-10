import React from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
			<div className="relative animate-fade-in" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
}
