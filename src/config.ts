import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	ExtendedConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "晓正杨博客",
	subtitle: "让代码更有价值，让学生生活不再枯燥",
	lang: "zh_CN",
	keywords: "前端,网络技术,服务器部署,静态网站搭建,CDN优化,无服务器架构,前后端开发",
	description: "分享网络技术、服务器部署、静态网站搭建、CDN优化、无服务器架构、前后端开发等技术教程与实践经验的个人技术博客，专注于云原生、无服务器架构和前后端开发。",
	// themeColor: {
	themeColor: {
		hue: 170, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "https://api.fis.ink/mc", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		
		{
		  src: 'https://q1.qlogo.cn/g?b=qq&nk=2540797494&s=640',    // Path of the favicon, relative to the /public directory
		  theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		  sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "友链",
			url: "/friends/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		LinkPreset.About,
		{
			name: "开往",
			url: "https://www.travellings.cn/typewriter.html",
			external: true, // Show an external link icon and will open in a new tab
		}
		

		
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://q1.qlogo.cn/g?b=qq&nk=2540797494&s=640", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "晓正杨",
	bio: "让代码更有价值，让学生生活不再枯燥",
	links: [
		
		{
			name: "",
			icon: "fa6-brands:github",
			url: "https://github.com/0x6768",
		},
		{
			name: "Bili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/493847518",
		}
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};


export const extendedConfig:ExtendedConfig = {
	twikoo: {
		envId: "https://twikoo.7003410.xyz",
	},
	umami: {
		baseUrl: "https://hm.7003410.xyz",
		shareId: "dV8cZEmYB2VXKyJs",
	},
};