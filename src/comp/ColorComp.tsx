import Color from "colorjs.io"
import { createMemo, createSignal, Show } from "solid-js"
import {
	sz_color,
	sz_color__dark,
	sz_color_button__a,
	sz_color_button__c,
	sz_color_button__h,
	sz_color_button__l,
	sz_color_inner,
	sz_selected,
} from "./ClassName"
import { useContextAppStore } from "./ContextAppStore"

export interface ColorCompProps {
	_color: string
	_setColor: (index: number, c: string) => void
	_index: number
	_selected?: boolean
}

export function ColorComp(props: ColorCompProps) {
	const { appStore, updateAppStore } = useContextAppStore()
	const getColor = createMemo(() => {
		try {
			return new Color(props._color).to("lch")
		} catch (e) {
			console.warn(e)
			return new Color("black").to("lch")
		}
	})
	const getOutputColor = createMemo(() => getColor().to(appStore.outputSpace))
	const getOutput = createMemo(() =>
		getOutputColor().toString({
			format: appStore.outputSpace === "srgb" ? "hex" : undefined,
		}),
	)
	const [getInnerRef, setInnerRef] = createSignal<HTMLDivElement>()
	function drag(key: "l" | "c" | "h" | "a") {
		updateAppStore((it) => {
			it.channel = key
		})
		function onMove(e: PointerEvent) {
			const rect = getInnerRef()?.getBoundingClientRect()
			if (!rect) return
			const ratio =
				1 - Math.min(1, Math.max(0, (e.pageY - rect.top) / rect.height))
			const color = getColor().clone()
			switch (key) {
				case "l":
					color.lch.l = ratio * 100
					break
				case "c":
					color.lch.c = ratio * 100
					break
				case "h":
					color.lch.h = ratio * 360
					break
				case "a":
					color.alpha = ratio
					break
			}
			props._setColor(props._index, color.toString())
		}
		function onEnd() {
			window.removeEventListener("pointermove", onMove)
			window.removeEventListener("pointerup", onEnd)
			window.removeEventListener("pointercancel", onEnd)
		}
		window.addEventListener("pointermove", onMove)
		window.addEventListener("pointerup", onEnd)
		window.addEventListener("pointercancel", onEnd)
	}
	return (
		<div
			class={getColor().lch.l < 50 ? sz_color__dark : sz_color}
			style={{
				background: getOutput(),
			}}
			onPointerDown={(e) => {
				const isThis =
					e.target === e.currentTarget || e.target === getInnerRef()
				updateAppStore((it) => {
					it.lastSelected = it.selected
					it.selected =
						it.selected === props._index && isThis ? -1 : props._index
				})
			}}
		>
			<Show when={props._selected}>
				<div class={sz_selected} />
			</Show>
			<div ref={setInnerRef} class={sz_color_inner}>
				{props._index + 1}: {getOutput()}
				<Show when={!getOutputColor().inGamut()}>
					<br />
					<button
						onClick={() => {
							props._setColor(
								props._index,
								getOutputColor()
									.toGamut()
									.toString({
										format: appStore.outputSpace === "srgb" ? "hex" : "",
									}),
							)
						}}
					>
						Gamut!
					</button>
				</Show>
				<div
					class={sz_color_button__l}
					style={{ bottom: Math.min(100, Math.max(0, getColor().lch.l)) + "%" }}
					onPointerDown={() => {
						drag("l")
					}}
				>
					L
				</div>
				<div
					class={sz_color_button__c}
					style={{ bottom: Math.min(100, Math.max(0, getColor().lch.c)) + "%" }}
					onPointerDown={() => {
						drag("c")
					}}
				>
					C
				</div>
				<div
					class={sz_color_button__h}
					style={{
						bottom:
							(Math.min(360, Math.max(0, getColor().lch.h)) / 360) * 100 + "%",
					}}
					onPointerDown={() => {
						drag("h")
					}}
				>
					H
				</div>
				<div
					class={sz_color_button__a}
					style={{
						bottom: Math.min(1, Math.max(0, getColor().alpha)) * 100 + "%",
					}}
					onPointerDown={() => {
						drag("a")
					}}
				>
					A
				</div>
			</div>
		</div>
	)
}
