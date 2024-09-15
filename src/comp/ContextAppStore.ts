import { createContext, useContext } from "solid-js"
import { IAppState } from "../model/IAppState"

export const ContextAppStore = createContext<{
	appStore: IAppState
	updateAppStore: (updater: (it: IAppState) => void) => void
}>()

export function useContextAppStore() {
	const it = useContext(ContextAppStore)
	if (!it) throw new Error(`[sjv366] ContextAppStore not defined.`)
	return it
}
