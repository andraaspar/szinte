import Color from 'colorjs.io'
import { IAppState } from '../model/IAppState'

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
	const c1 = new Color(appStore.palette[i1]).to('oklch')
	const c2 = new Color(appStore.palette[i2]).to('oklch')
	const steps = i2 - i1 - 1
	updateAppStore((it) => {
		for (let i = 1; i <= steps; i++) {
			const t = interpolation(i / (steps + 1))
			const index = i1 + i
			const c = new Color(it.palette[index]).to('oklch')
			switch (it.channel) {
				case 'l':
					c.oklch.l = c1.oklch.l + (c2.oklch.l - c1.oklch.l) * t
					break
				case 'c':
					c.oklch.c = c1.oklch.c + (c2.oklch.c - c1.oklch.c) * t
					break
				case 'h':
					c.oklch.h = c1.oklch.h + (c2.oklch.h - c1.oklch.h) * t
					break
				case 'a':
					c.alpha = c1.alpha + (c2.alpha - c1.alpha) * t
					break
			}
			it.palette[index] = c.toString()
		}
	})
}
