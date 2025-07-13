// Legacy types - deprecated, use FormResult instead
export type ActionState = {
	success?: boolean;
	error?: string;
};

export type AuthActionState = ActionState & {
	email?: string;
};
