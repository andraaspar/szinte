export interface IAppState {
	palette: string[]
	output: string
	selected: number
	lastSelected: number
	channel: "l" | "c" | "h" | "a"
}
