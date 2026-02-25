"use client";

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
exports.default = RefineEditor;
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var EntityPicker_1 = require("./EntityPicker");
var LocationChip_1 = require("./LocationChip");
var PersonChip_1 = require("./PersonChip");
function RefineEditor(_a) {
    var content = _a.content, people = _a.people, locations = _a.locations, allPeople = _a.allPeople, onChange = _a.onChange, onEntitiesChange = _a.onEntitiesChange;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_1.useState)(null), selectedText = _b[0], setSelectedText = _b[1];
    var _c = (0, react_1.useState)(null), showEntityPicker = _c[0], setShowEntityPicker = _c[1];
    var contentRef = (0, react_1.useRef)(null);
    // Parse content into segments
    var segments = (0, react_1.useMemo)(() => {
        var result = [];
        var regex = /\[(person|location):([^\]]+)\]/g;
        var lastIndex = 0;
        var match;
        var peopleMap = new Map(people.map((p) => [p.id, p]));
        var locationsMap = new Map(locations.map((l) => [l.placeId, l]));
        match = regex.exec(content);
        while (match !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                result.push({
                    type: "text",
                    value: content.slice(lastIndex, match.index),
                });
            }
            // Add the entity reference
            var fullMatch = match[0], type = match[1], id = match[2];
            if (type === "person" && id) {
                var person = peopleMap.get(id);
                if (person) {
                    result.push({
                        type: "person",
                        value: fullMatch,
                        entity: person,
                    });
                }
                else {
                    // If person not found, treat as text
                    result.push({ type: "text", value: fullMatch });
                }
            }
            else if (type === "location" && id) {
                var location_1 = locationsMap.get(id);
                if (location_1) {
                    result.push({
                        type: "location",
                        value: fullMatch,
                        entity: location_1,
                    });
                }
                else {
                    // If location not found, treat as text
                    result.push({ type: "text", value: fullMatch });
                }
            }
            lastIndex = match.index + fullMatch.length;
            match = regex.exec(content);
        }
        // Add remaining text
        if (lastIndex < content.length) {
            result.push({
                type: "text",
                value: content.slice(lastIndex),
            });
        }
        return result;
    }, [content, people, locations]);
    // Handle text selection
    var handleTextSelection = (0, react_1.useCallback)(() => {
        var selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setSelectedText(null);
            return;
        }
        var text = selection.toString().trim();
        if (!text) {
            setSelectedText(null);
            return;
        }
        // For position-based replacement, we need to find where this text appears
        // in the raw content string. We'll use a different approach: track the
        // number of times this exact text has appeared before the current selection
        var range = selection.getRangeAt(0);
        var contentDiv = contentRef.current;
        if (!contentDiv) {
            setSelectedText(null);
            return;
        }
        // Find all text nodes before the selection start
        var textBeforeSelection = "";
        var walker = document.createTreeWalker(contentDiv, NodeFilter.SHOW_TEXT, null);
        var currentNode = walker.nextNode();
        while (currentNode) {
            if (currentNode === range.startContainer) {
                // Add the text up to the selection start offset
                textBeforeSelection += (currentNode.textContent || "").substring(0, range.startOffset);
                break;
            }
            // Add the entire text content of this node
            textBeforeSelection += currentNode.textContent || "";
            currentNode = walker.nextNode();
        }
        // Now find the position in the actual content string
        // by counting occurrences of the selected text that appear before this position
        var escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var beforeMatches = (textBeforeSelection.match(new RegExp(escapedText, "g")) || []).length;
        // Find the nth occurrence of the selected text in the content
        var searchFrom = 0;
        var contentPosition = -1;
        for (var i = 0; i <= beforeMatches; i++) {
            contentPosition = content.indexOf(text, searchFrom);
            if (contentPosition === -1)
                break;
            searchFrom = contentPosition + 1;
        }
        if (contentPosition === -1) {
            // Fallback: just find the first occurrence
            contentPosition = content.indexOf(text);
        }
        setSelectedText({
            text: text,
            start: contentPosition,
            end: contentPosition + text.length,
        });
    }, [content]);
    // Listen for selection changes
    (0, react_1.useEffect)(() => {
        var onSelectionChange = () => {
            var selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && contentRef.current) {
                var range = selection.getRangeAt(0);
                if (contentRef.current.contains(range.commonAncestorContainer)) {
                    handleTextSelection();
                    return;
                }
            }
            setSelectedText(null);
        };
        document.addEventListener("selectionchange", onSelectionChange);
        return () => document.removeEventListener("selectionchange", onSelectionChange);
    }, [handleTextSelection]);
    // Remove entity
    var handleRemoveEntity = (0, react_1.useCallback)((segment) => {
        var replacementText = segment.entity && "name" in segment.entity ? segment.entity.name : "";
        var newContent = content.replace(segment.value, replacementText);
        onChange(newContent);
        // Check if we need to remove from the entities list (if no longer referenced)
        if (onEntitiesChange && segment.entity) {
            var isPerson = "userId" in segment.entity;
            var idStr = isPerson
                ? "[person:".concat(segment.entity.id, "]")
                : "[location:".concat(segment.entity.placeId, "]");
            // Check if the entity is still mentioned elsewhere in the *new* content
            if (!newContent.includes(idStr)) {
                if (isPerson) {
                    var newPeople = people.filter((p) => p.id !== segment.entity.id);
                    onEntitiesChange(newPeople, locations);
                }
                else {
                    var newLocations = locations.filter((l) => l.placeId !== segment.entity.placeId);
                    onEntitiesChange(people, newLocations);
                }
            }
        }
    }, [content, onChange, onEntitiesChange, people, locations]);
    // Add or replace entity reference
    var handleAddEntity = (0, react_1.useCallback)((entity) => {
        var isPerson = "userId" in entity;
        var replacement = isPerson
            ? "[person:".concat(entity.id, "]")
            : "[location:".concat(entity.placeId, "]");
        if (showEntityPicker === null || showEntityPicker === void 0 ? void 0 : showEntityPicker.editingSegment) {
            // Replace existing entity
            var newContent = content.replace(showEntityPicker.editingSegment.value, replacement);
            onChange(newContent);
            // Update the people/locations arrays if needed for consistency
            if (onEntitiesChange && showEntityPicker.editingSegment) {
                if (isPerson) {
                    // Update people array
                    var newPeople = people.filter((p) => {
                        var _a, _b;
                        return p.id !==
                            ((_b = (_a = showEntityPicker.editingSegment) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.id);
                    });
                    newPeople.push(entity);
                    onEntitiesChange(newPeople, locations);
                }
                else {
                    // Update locations array
                    var newLocations = locations.filter((l) => {
                        var _a, _b;
                        return l.placeId !==
                            ((_b = (_a = showEntityPicker.editingSegment) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.placeId);
                    });
                    newLocations.push(entity);
                    onEntitiesChange(people, newLocations);
                }
            }
        }
        else if ((showEntityPicker === null || showEntityPicker === void 0 ? void 0 : showEntityPicker.selection) || selectedText) {
            var selection = (showEntityPicker === null || showEntityPicker === void 0 ? void 0 : showEntityPicker.selection) || selectedText;
            if (!selection)
                return;
            // Replace the specific selected text using position-based replacement
            var beforeSelection = content.substring(0, selection.start);
            var afterSelection = content.substring(selection.end);
            var newContent = beforeSelection + replacement + afterSelection;
            onChange(newContent);
            // Also update the entities arrays so the chip renders immediately
            if (onEntitiesChange) {
                if (isPerson) {
                    // Add person to people array if not already there
                    var personExists = people.some((p) => p.id === entity.id);
                    if (!personExists) {
                        onEntitiesChange(__spreadArray(__spreadArray([], people, true), [entity], false), locations);
                    }
                }
                else {
                    // Add location to locations array if not already there
                    var locationExists = locations.some((l) => l.placeId === entity.placeId);
                    if (!locationExists) {
                        onEntitiesChange(people, __spreadArray(__spreadArray([], locations, true), [entity], false));
                    }
                }
            }
            setSelectedText(null);
        }
        setShowEntityPicker(null);
    }, [
        content,
        onChange,
        selectedText,
        showEntityPicker,
        people,
        locations,
        onEntitiesChange,
    ]);
    // Show entity picker for editing an existing entity
    var handleEditEntity = (0, react_1.useCallback)((segment, event) => {
        var _a, _b;
        event.stopPropagation();
        var contentRect = (_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var targetRect = event.currentTarget.getBoundingClientRect();
        if (contentRect) {
            setShowEntityPicker({
                type: segment.type,
                position: {
                    top: targetRect.bottom - contentRect.top + 5,
                    left: targetRect.left - contentRect.left,
                },
                editingSegment: segment,
                initialQuery: ((_b = segment.entity) === null || _b === void 0 ? void 0 : _b.name) || "",
            });
        }
    }, []);
    // Show entity picker for marking selected text
    var handleMarkAs = (0, react_1.useCallback)((type) => {
        var _a, _b;
        if (!selectedText)
            return;
        var rect = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.getRangeAt(0).getBoundingClientRect();
        var contentRect = (_b = contentRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        if (rect && contentRect) {
            setShowEntityPicker({
                type: type,
                position: {
                    top: rect.bottom - contentRect.top + 10,
                    left: rect.left - contentRect.left,
                },
                initialQuery: selectedText.text,
                selection: { start: selectedText.start, end: selectedText.end },
            });
        }
    }, [selectedText]);
    return (<div className="relative">
			<div ref={contentRef} className="min-h-[300px] p-6 text-lg text-gray-700 bg-gray-50/50 border-0 rounded-xl transition-colors shadow-inner prose max-w-none prose-p:my-0 prose-headings:my-2 focus-within:bg-white outline-none">
				{segments.map((segment, index) => {
            if (segment.type === "text") {
                return (<span key={"text-".concat(index, "-").concat(segment.value.slice(0, 10))} className="whitespace-pre-wrap">
								{segment.value}
							</span>);
            }
            if (segment.type === "person" && segment.entity) {
                return (<PersonChip_1.default key={"person-".concat(segment.entity.id)} person={segment.entity} onRemove={() => handleRemoveEntity(segment)} onEdit={(e) => handleEditEntity(segment, e)} className="mx-1"/>);
            }
            if (segment.type === "location" && segment.entity) {
                return (<LocationChip_1.default key={"location-".concat(segment.entity.placeId)} location={segment.entity} onRemove={() => handleRemoveEntity(segment)} onEdit={(e) => handleEditEntity(segment, e)} className="mx-1"/>);
            }
            return null;
        })}
			</div>

			{/* Selection Actions */}
			{selectedText && (<div className="mt-2 flex gap-2">
					<button type="button" onClick={() => handleMarkAs("person")} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
						{t("diary.markAsPerson")}
					</button>
					<button type="button" onClick={() => handleMarkAs("location")} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
						{t("diary.markAsLocation")}
					</button>
				</div>)}

			{/* Entity Picker */}
			{showEntityPicker && (<EntityPicker_1.default type={showEntityPicker.type} onSelect={handleAddEntity} onClose={() => setShowEntityPicker(null)} people={allPeople} position={showEntityPicker.position} initialQuery={showEntityPicker.initialQuery}/>)}
		</div>);
}
