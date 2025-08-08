"use client";

import type React from "react";
import { createContext, useContext, useReducer } from "react";

export interface ProcessingJob {
	id: string;
	content: string;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
}

interface ProcessingState {
	jobs: ProcessingJob[];
}

type ProcessingAction =
	| { type: "START_PROCESSING"; payload: { id: string; content: string } }
	| {
			type: "UPDATE_STATUS";
			payload: { id: string; status: ProcessingJob["status"] };
	  }
	| {
			type: "COMPLETE_PROCESSING";
			payload: { id: string; success: boolean; error?: string };
	  }
	| { type: "REMOVE_JOB"; payload: { id: string } };

const ProcessingContext = createContext<{
	state: ProcessingState;
	startProcessing: (id: string, content: string) => void;
	updateStatus: (id: string, status: ProcessingJob["status"]) => void;
	completeProcessing: (id: string, success: boolean, error?: string) => void;
	removeJob: (id: string) => void;
	getJob: (id: string) => ProcessingJob | undefined;
	getActiveJobs: () => ProcessingJob[];
} | null>(null);

function processingReducer(
	state: ProcessingState,
	action: ProcessingAction,
): ProcessingState {
	switch (action.type) {
		case "START_PROCESSING":
			return {
				...state,
				jobs: [
					...state.jobs,
					{
						id: action.payload.id,
						content: action.payload.content,
						status: "pending",
					},
				],
			};

		case "UPDATE_STATUS":
			return {
				...state,
				jobs: state.jobs.map((job) =>
					job.id === action.payload.id
						? { ...job, status: action.payload.status }
						: job,
				),
			};

		case "COMPLETE_PROCESSING":
			return {
				...state,
				jobs: state.jobs.map((job) =>
					job.id === action.payload.id
						? {
								...job,
								status: action.payload.success ? "completed" : "failed",
								error: action.payload.error,
							}
						: job,
				),
			};

		case "REMOVE_JOB":
			return {
				...state,
				jobs: state.jobs.filter((job) => job.id !== action.payload.id),
			};

		default:
			return state;
	}
}

export function ProcessingProvider({
	children,
}: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(processingReducer, { jobs: [] });

	const startProcessing = (id: string, content: string) => {
		dispatch({ type: "START_PROCESSING", payload: { id, content } });
	};

	const updateStatus = (id: string, status: ProcessingJob["status"]) => {
		dispatch({ type: "UPDATE_STATUS", payload: { id, status } });
	};

	const completeProcessing = (id: string, success: boolean, error?: string) => {
		dispatch({ type: "COMPLETE_PROCESSING", payload: { id, success, error } });
	};

	const removeJob = (id: string) => {
		dispatch({ type: "REMOVE_JOB", payload: { id } });
	};

	const getJob = (id: string) => {
		return state.jobs.find((job) => job.id === id);
	};

	const getActiveJobs = () => {
		return state.jobs.filter(
			(job) => job.status === "pending" || job.status === "processing",
		);
	};

	return (
		<ProcessingContext.Provider
			value={{
				state,
				startProcessing,
				updateStatus,
				completeProcessing,
				removeJob,
				getJob,
				getActiveJobs,
			}}
		>
			{children}
		</ProcessingContext.Provider>
	);
}

export function useProcessing() {
	const context = useContext(ProcessingContext);
	if (!context) {
		throw new Error("useProcessing must be used within a ProcessingProvider");
	}
	return context;
}
