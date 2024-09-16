import Color from "colorjs.io"
import { IAppState } from "../model/IAppState"
import { OutputFormat } from "../model/OutputFomat"
import { join } from "./join"
import { joinArrayWith } from "./joinArrayWith"
import { joinWith } from "./joinWith"

export function getOutput({ appStore }: { appStore: IAppState }) {
	switch (appStore.outputFormat) {
		case OutputFormat.Gimp:
			return (
				joinWith("\n")(
					`GIMP Palette`,
					`Name: ${appStore.fileName}`,
					`#`,
					joinArrayWith("\n")(
						appStore.palette.map((color, index) => {
							const wrappedColor = new Color(color).to("srgb")
							return join(
								joinWith(" ")(
									Math.round(wrappedColor.srgb.r * 255)
										.toString()
										.padStart(3, " "),
									Math.round(wrappedColor.srgb.g * 255)
										.toString()
										.padStart(3, " "),
									Math.round(wrappedColor.srgb.b * 255)
										.toString()
										.padStart(3, " "),
								),
								"\t",
								index + 1 + "",
							)
						}),
					),
				) + "\n"
			)
		case OutputFormat.Synfig:
			return (
				joinWith("\n\n")(
					joinWith("\n")(`SYNFIGPAL1.0`, appStore.fileName),
					joinArrayWith("\n\n")(
						appStore.palette.map((color) => {
							const wrappedColor = new Color(color).to("srgb")
							return joinWith("\n")(
								wrappedColor.srgb.r,
								wrappedColor.srgb.g,
								wrappedColor.srgb.b,
								wrappedColor.alpha,
							)
						}),
					),
				) + "\n"
			)
		case OutputFormat.Css:
			return (
				joinWith("\n")(
					`:root {`,
					joinArrayWith("\n")(
						appStore.palette.map((color, index): string =>
							join(
								`\t--`,
								index + 1 + "",
								`: `,
								new Color(color).to(appStore.outputSpace).toString({
									format: appStore.outputSpace === "srgb" ? "hex" : undefined,
								}),
								`;`,
							),
						),
					),
					`}`,
				) + "\n"
			)
		default:
			throw new Error(`[qjqvd9] Unknown OutputFormat: ${appStore.outputFormat}`)
	}
}
