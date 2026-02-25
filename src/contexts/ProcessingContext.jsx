"use client";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.hasOwn(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingProvider = ProcessingProvider;
exports.useProcessing = useProcessing;
var react_1 = require("react");
var ProcessingContext = (0, react_1.createContext)(null);
function processingReducer(state, action) {
    switch (action.type) {
        case "START_PROCESSING":
            return __assign(__assign({}, state), { jobs: __spreadArray(__spreadArray([], state.jobs, true), [
                    {
                        id: action.payload.id,
                        content: action.payload.content,
                        status: "pending",
                    },
                ], false) });
        case "UPDATE_STATUS":
            return __assign(__assign({}, state), { jobs: state.jobs.map((job) => job.id === action.payload.id
                        ? __assign(__assign({}, job), { status: action.payload.status }) : job) });
        case "COMPLETE_PROCESSING":
            return __assign(__assign({}, state), { jobs: state.jobs.map((job) => job.id === action.payload.id
                        ? __assign(__assign({}, job), { status: action.payload.success ? "completed" : "failed", error: action.payload.error }) : job) });
        case "REMOVE_JOB":
            return __assign(__assign({}, state), { jobs: state.jobs.filter((job) => job.id !== action.payload.id) });
        default:
            return state;
    }
}
function ProcessingProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(processingReducer, { jobs: [] }), state = _b[0], dispatch = _b[1];
    var startProcessing = (id, content) => {
        dispatch({ type: "START_PROCESSING", payload: { id: id, content: content } });
    };
    var updateStatus = (id, status) => {
        dispatch({ type: "UPDATE_STATUS", payload: { id: id, status: status } });
    };
    var completeProcessing = (id, success, error) => {
        dispatch({ type: "COMPLETE_PROCESSING", payload: { id: id, success: success, error: error } });
    };
    var removeJob = (id) => {
        dispatch({ type: "REMOVE_JOB", payload: { id: id } });
    };
    var getJob = (id) => state.jobs.find((job) => job.id === id);
    var getActiveJobs = () => state.jobs.filter((job) => job.status === "pending" || job.status === "processing");
    return (<ProcessingContext.Provider value={{
            state: state,
            startProcessing: startProcessing,
            updateStatus: updateStatus,
            completeProcessing: completeProcessing,
            removeJob: removeJob,
            getJob: getJob,
            getActiveJobs: getActiveJobs,
        }}>
			{children}
		</ProcessingContext.Provider>);
}
function useProcessing() {
    var context = (0, react_1.useContext)(ProcessingContext);
    if (!context) {
        throw new Error("useProcessing must be used within a ProcessingProvider");
    }
    return context;
}
