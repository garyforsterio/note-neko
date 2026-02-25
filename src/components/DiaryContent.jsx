
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryContent = DiaryContent;
var react_markdown_1 = require("react-markdown");
var maps_1 = require("#lib/utils/maps");
function populateLinks(_a) {
    var content = _a.content, people = _a.people, locations = _a.locations, locale = _a.locale;
    var transformedContent = content;
    // Replace person mentions with markdown links
    for (var _i = 0, _b = people !== null && people !== void 0 ? people : []; _i < _b.length; _i++) {
        var person = _b[_i];
        transformedContent = transformedContent.replace(new RegExp("\\[person:".concat(person.id, "\\]"), "g"), "[".concat(person.nickname || person.name, "](/").concat(locale, "/people/").concat(person.id, ")"));
    }
    // Replace location mentions with markdown links
    for (var _c = 0, _d = locations !== null && locations !== void 0 ? locations : []; _c < _d.length; _c++) {
        var location_1 = _d[_c];
        transformedContent = transformedContent.replace(new RegExp("\\[location:".concat(location_1.placeId, "\\]"), "g"), "[".concat(location_1.name, "](").concat((0, maps_1.getGoogleMapsUrl)(location_1.placeId, location_1.lat, location_1.lng), ")"));
    }
    return transformedContent;
}
function DiaryContent(_a) {
    var content = _a.content, people = _a.people, locations = _a.locations, locale = _a.locale;
    return (<react_markdown_1.default components={{
            a: (_a) => {
                var children = _a.children, href = _a.href;
                return (<a className="text-blue-500 underline" href={href} target="_blank" rel="noopener noreferrer">
							{children}
						</a>);
            },
            h1: (_a) => {
                var children = _a.children;
                return <h1 className="text-2xl font-bold">{children}</h1>;
            },
            h2: (_a) => {
                var children = _a.children;
                return <h2 className="text-xl font-bold">{children}</h2>;
            },
            h3: (_a) => {
                var children = _a.children;
                return <h3 className="text-lg font-bold">{children}</h3>;
            },
            h4: (_a) => {
                var children = _a.children;
                return <h4 className="text-base font-bold">{children}</h4>;
            },
            h5: (_a) => {
                var children = _a.children;
                return <h5 className="text-sm font-bold">{children}</h5>;
            },
            h6: (_a) => {
                var children = _a.children;
                return <h6 className="text-xs font-bold">{children}</h6>;
            },
            p: (_a) => {
                var children = _a.children;
                return <p className="text-base">{children}</p>;
            },
            ul: (_a) => {
                var children = _a.children;
                return <ul className="list-disc list-inside">{children}</ul>;
            },
            ol: (_a) => {
                var children = _a.children;
                return <ol className="list-decimal list-inside">{children}</ol>;
            },
            li: (_a) => {
                var children = _a.children;
                return <li className="text-base">{children}</li>;
            },
            blockquote: (_a) => {
                var children = _a.children;
                return (<blockquote className="border-l-4 border-gray-300 pl-4">
							{children}
						</blockquote>);
            },
            code: (_a) => {
                var children = _a.children;
                return <code className="bg-gray-100 p-1 rounded">{children}</code>;
            },
            img: (_a) => {
                var src = _a.src, alt = _a.alt;
                // biome-ignore lint/performance/noImgElement: External markdown images can't use next/image
                return <img src={src} alt={alt} className="w-full"/>;
            },
            pre: (_a) => {
                var children = _a.children;
                return <pre className="bg-gray-100 p-4 rounded">{children}</pre>;
            },
            table: (_a) => {
                var children = _a.children;
                return <table className="w-full">{children}</table>;
            },
            tr: (_a) => {
                var children = _a.children;
                return <tr className="border-b">{children}</tr>;
            },
            th: (_a) => {
                var children = _a.children;
                return <th className="border-b p-2">{children}</th>;
            },
            td: (_a) => {
                var children = _a.children;
                return <td className="border-b p-2">{children}</td>;
            },
            hr: () => <hr className="my-4"/>,
        }}>
			{populateLinks({
            content: content,
            people: people,
            locations: locations,
            locale: locale,
        })}
		</react_markdown_1.default>);
}
