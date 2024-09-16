import Color from "colorjs.io"
import { IAppState } from "../model/IAppState"

export function applyInterpolation({
	interpolation,
	appStore,
	updateAppStore,
}: {
	interpolation: (t: number) => number
	appStore: IAppState
	updateAppStore: (updater: (it: IAppState) => void) => void
}) {
	const i1 = Math.min(appStore.selected, appStore.lastSelected)
	const i2 = Math.max(appStore.selected, appStore.lastSelected)
	const c1 = new Color(appStore.palette[i1]).to("lch")
	const c2 = new Color(appStore.palette[i2]).to("lch")
	const steps = i2 - i1 - 1
	updateAppStore((it) => {
		for (let i = 1; i <= steps; i++) {
			const t = interpolation(i / (steps + 1))
			const index = i1 + i
			const c = new Color(it.palette[index]).to("lch")
			switch (it.channel) {
				case "l":
					c.lch.l = c1.lch.l + (c2.lch.l - c1.lch.l) * t
					break
				case "c":
					c.lch.c = c1.lch.c + (c2.lch.c - c1.lch.c) * t
					break
				case "h":
					c.lch.h = c1.lch.h + (c2.lch.h - c1.lch.h) * t
					break
				case "a":
					c.alpha = c1.alpha + (c2.alpha - c1.alpha) * t
					break
			}
			it.palette[index] = c.toString()
		}
	})
}
