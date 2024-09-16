import { createEffect, createMemo, createSelector, Index, Show } from "solid-js"
import { createStore, produce, reconcile } from "solid-js/store"
import { applyInterpolation } from "../fun/applyInterpolation"
import { easeInInterpolation } from "../fun/easeInInterpolation"
import { easeInOutInterpolation } from "../fun/easeInOutInterpolation"
import { easeOutInterpolation } from "../fun/easeOutInterpolation"
import { getExtensionByOutputFormat } from "../fun/getExtensionByOutputFormat"
import { getOutput } from "../fun/getOutput"
import { linearInterpolation } from "../fun/linearInterpolation"
import { IAppState } from "../model/IAppState"
import { OutputFormat } from "../model/OutputFomat"
import { sz_dark, sz_row__1 } from "./ClassName"
import { ColorComp } from "./ColorComp"
import { ContextAppStore } from "./ContextAppStore"

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const [appStore, setAppStore] = createStore<IAppState>({
		palette: ["slategray"],
		outputSpace: "lch",
		selected: -1,
		lastSelected: -1,
		channel: "l",
		outputFormat: OutputFormat.Css,
		fileName: "palette",
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
	const getOutputValue = createMemo(() => getOutput({ appStore }))
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
					value={appStore.outputSpace}
					onChange={(e) => {
						updateAppStore((it) => {
							it.outputSpace = e.currentTarget.value
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
			<div class={sz_row__1}>
				<input
					value={appStore.fileName}
					onInput={(e) => {
						const value = e.currentTarget.value
						updateAppStore((it) => {
							it.fileName = value
						})
					}}
				/>
				<select
					value={appStore.outputFormat}
					onChange={(e) => {
						const value = e.currentTarget.value as OutputFormat
						updateAppStore((it) => {
							it.outputFormat = value
						})
					}}
				>
					<option value={OutputFormat.Css} label={"CSS"} />
					<option value={OutputFormat.Gimp} label={"Gimp"} />
					<option value={OutputFormat.Synfig} label={"Synfig"} />
				</select>
				<button
					onClick={() => {
						navigator.clipboard.writeText(getOutputValue())
					}}
				>
					Copy
				</button>
				<a
					href={"#"}
					download={
						appStore.fileName +
						"." +
						getExtensionByOutputFormat(appStore.outputFormat)
					}
					onPointerDown={(e) => {
						const file = new Blob([getOutputValue()], { type: "text/plain" })
						e.currentTarget.href = URL.createObjectURL(file)
					}}
				>
					Save
				</a>
			</div>
			<textarea value={getOutputValue()} readonly rows={10} />
		</ContextAppStore.Provider>
	)
}
