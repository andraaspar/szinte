import { OutputFormat } from "./OutputFomat"

export interface IAppState {
	palette: string[]
	outputSpace: string
	selected: number
	lastSelected: number
	channel: "l" | "c" | "h" | "a"
	outputFormat: OutputFormat
	fileName: string
}
