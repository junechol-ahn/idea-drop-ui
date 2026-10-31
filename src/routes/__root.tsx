import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../styles.css";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				name: "description",
				content:
					"Share, explore and build on the best startup ideas and side hustles",
			},
			{
				title: "IdeaDrop - Your Idea Hub",
			},
		],
	}),
	component: RootComponent,
	notFoundComponent: () => <div>404 Not Found</div>,
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
