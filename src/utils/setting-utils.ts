import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

/**
 * 获取默认主题色相（来自配置载体或回退值）
 * @returns {number} 默认色相值
 */
export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

/**
 * 获取当前主题色相（本地存储优先，其次默认值）
 * @returns {number} 当前色相值
 */
export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

/**
 * 设置主题色相到本地存储并应用到根元素
 * @param {number} hue - 色相值
 * @returns {void}
 */
export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

/**
 * 将主题模式应用到文档元素并设置代码主题
 * @param {LIGHT_DARK_MODE} theme - 主题模式
 * @returns {void}
 */
export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

/**
 * 设置并应用主题模式
 * @param {LIGHT_DARK_MODE} theme - 主题模式
 * @returns {void}
 */
export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

/**
 * 从本地存储获取主题模式（无则返回默认主题）
 * @returns {LIGHT_DARK_MODE} 主题模式
 */
export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
