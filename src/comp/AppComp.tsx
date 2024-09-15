import { createEffect, createSelector, Index, Show } from "solid-js"
import { createStore, produce, reconcile } from "solid-js/store"
import { applyInterpolation } from "../css/fun/applyInterpolation"
import { easeInInterpolation } from "../css/fun/easeInInterpolation"
import { easeInOutInterpolation } from "../css/fun/easeInOutInterpolation"
import { easeOutInterpolation } from "../css/fun/easeOutInterpolation"
import { linearInterpolation } from "../css/fun/linearInterpolation"
import { IAppState } from "../model/IAppState"
import { sz_dark, sz_row__1 } from "./ClassName"
import { ColorComp } from "./ColorComp"
import { ContextAppStore } from "./ContextAppStore"

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const [appStore, setAppStore] = createStore<IAppState>({
		palette: ["slategray"],
		output: "lch",
		selected: -1,
		lastSelected: -1,
		channel: "l",
	})
	function updateAppStore(updater: (it: IAppState) => void) {
		setAppStore(produce(updater))
	}
	function onHashChange() {
		try {
			const json = decodeURIComponent(location.hash.slice(1))
			if (json) {
				const state = JSON.parse(json)
				setAppStore(reconcile(state))
			}
		} catch (e) {
			console.error(e)
		}
	}
	window.addEventListener("hashchange", onHashChange)
	onHashChange()
	createEffect(() => {
		location.replace("#" + encodeURIComponent(JSON.stringify(appStore)))
	})
	function setColor(index: number, c: string) {
		updateAppStore((it) => {
			it.palette.splice(index, 1, c)
		})
	}
	const selectedIndex = createSelector(() => appStore.selected)
	return (
		<ContextAppStore.Provider value={{ appStore, updateAppStore }}>
			<div class={sz_row__1}>
				<button
					onClick={() => {
						document.documentElement.classList.toggle(sz_dark)
					}}
				>
					Light
				</button>
				<select
					value={appStore.output}
					onChange={(e) => {
						updateAppStore((it) => {
							it.output = e.currentTarget.value
						})
					}}
				>
					<option value={"lab"} label={"Lab"} />
					<option value={"lch"} label={"LCH"} />
					<option value={"oklch"} label={"Oklch"} />
					<option value={"p3"} label={"P3"} />
					<option value={"srgb"} label={"sRGB"} />
					<option value={"xyz"} label={"XYZ"} />
				</select>
			</div>
			<div class={sz_row__1}>
				<Index each={appStore.palette}>
					{(color, index) => (
						<ColorComp
							_color={color()}
							_index={index}
							_setColor={setColor}
							_selected={selectedIndex(index)}
						/>
					)}
				</Index>
				<button
					onClick={() => {
						updateAppStore((it) => {
							it.palette.push(it.palette.at(-1) ?? "slategray")
						})
					}}
				>
					+
				</button>
			</div>
			<Show when={appStore.palette[appStore.selected]}>
				{(getValue) => (
					<div class={sz_row__1}>
						<input
							value={getValue()}
							onInput={(e) => {
								const value = e.currentTarget.value
								updateAppStore((it) => {
									it.palette[it.selected] = value
								})
							}}
						/>
						<button
							onClick={() => {
								updateAppStore((it) => {
									it.palette.splice(it.selected, 1)
									it.selected = -1
									it.lastSelected = -1
								})
							}}
						>
							X
						</button>
					</div>
				)}
			</Show>
			<Show when={appStore.selected >= 0 && appStore.lastSelected >= 0}>
				<div class={sz_row__1}>
					<button
						onClick={() => {
							applyInterpolation({
								appStore,
								updateAppStore,
								interpolation: linearInterpolation,
							})
						}}
					>
						Linear
					</button>
					<button
						onClick={() => {
							applyInterpolation({
								appStore,
								updateAppStore,
								interpolation: easeInInterpolation(),
							})
						}}
					>
						Ease In
					</button>
					<button
						onClick={() => {
							applyInterpolation({
								appStore,
								updateAppStore,
								interpolation: easeOutInterpolation(),
							})
						}}
					>
						Ease Out
					</button>
					<button
						onClick={() => {
							applyInterpolation({
								appStore,
								updateAppStore,
								interpolation: easeInOutInterpolation(),
							})
						}}
					>
						Ease In Out
					</button>
				</div>
			</Show>
		</ContextAppStore.Provider>
	)
}
