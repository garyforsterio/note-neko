import type { Decorator } from "@storybook/react";
import { Suspense } from "react";

let PrevStory: Parameters<Decorator<object>>[0] | null = null;
let StoryPromise: null | undefined = undefined;
let promised = false;

const StoryPromiseWrapper = ({
	Story,
}: {
	Story: Parameters<Decorator<object>>[0];
}) => {
	if (PrevStory !== Story) {
		PrevStory = Story;
		const storyObj = Story();
		StoryPromise = undefined;
		promised = false;
		if ("render" in storyObj.type) {
			if (storyObj.type.render[Symbol.toStringTag] === "AsyncFunction") {
				StoryPromise = storyObj.type.render(storyObj.props).finally(() => {
					promised = true;
				});
			}
		} else {
			if (storyObj.type[Symbol.toStringTag] === "AsyncFunction") {
				StoryPromise = storyObj.type(storyObj.props).finally(() => {
					promised = true;
				});
			}
		}
	}
	if (!promised && StoryPromise) {
		throw StoryPromise;
	}
	if (StoryPromise === undefined) {
		return Story();
	}
	return StoryPromise;
};

export const rscDecorator: Decorator<object> = (Story) => {
	return (
		<Suspense>
			<StoryPromiseWrapper Story={Story} />
		</Suspense>
	);
};
