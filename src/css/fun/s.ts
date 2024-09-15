export function s(...rest: unknown[]): string {
	return rest.filter(Boolean).join(" ")
}
