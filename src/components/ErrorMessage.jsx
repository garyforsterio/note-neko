
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorMessage;
function ErrorMessage(_a) {
    var errors = _a.errors, id = _a.id;
    if (!errors)
        return null;
    return (<div className="p-4 bg-red-50 text-red-700 rounded-md" id={id}>
			{errors}
		</div>);
}
