import ora, { type Options, type Ora } from "ora";
import { lazy } from "../util/lazy.js";
import { Colors } from "./colors.js";

export const useSpinners = lazy(() => {
	const spinners: Ora[] = [];
	return spinners;
});

export function createSpinner(options: Options | string) {
	const spinners = useSpinners();
	const next = ora(options);
	spinners.push(next);
	Colors.mode("line");
	return next;
}
