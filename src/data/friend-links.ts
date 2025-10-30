export type FriendLinkItem = {
	title: string;
	url: string;
	avatar: string;
	desc: string;
};

export type FriendLinkSection = {
	title: string;
	items: FriendLinkItem[];
};

export const friendLinkSections: FriendLinkSection[] = [
	{
		title: "🌟 友情博客",
		items: [
			{
				title: "hoppinzq",
				url: "https://hoppinzq.com/hoppinai/",
				avatar: "https://hoppinzq.com/zui/static/picture/0.jpg",
				desc: "这是 zq 的网站",
			},
			{
				title: "PankitGG",
				url: "http://ai-nous.com/",
				avatar: "/static-images/PangitGG-avatar.jpg",
				desc: "探索AI技术的无限可能, 专注于AI技术分享和交流的平台, 在这里你可以找到最新的AI资讯、技术文章和学习资源。",
			},
			{
				title: "梦辰の小窝",
				url: "https://mc.mimeng.top/",
				avatar: "https://mc.mimeng.top/_astro/avatar.C0sWSkbw_Z2aF073.avif",
				desc: "Eagerly Anticipating Our Reunion",
			},
		],
	},
	// {
	//     title: "🛠️ 实用工具",
	//     items: [
	//         {
	//             title: "图片转Ico",
	//             url: "https://ico.pljzy.top",
	//             avatar: "https://ico.pljzy.top/logo.ico",
	//             desc: "在线png、jpg、jpeg图片转Ico工具",
	//         },
	//         {
	//             title: "文件快递柜",
	//             url: "https://share.pljzy.top",
	//             avatar: "https://share.pljzy.top/assets/logo_small.png",
	//             desc: "FileCodeBox, 文件快递柜, 口令传送箱, 匿名口令分享文本, 文件",
	//         },
	//         {
	//             title: "TXT转电子书工具",
	//             url: "https://ebook.deali.cn/",
	//             avatar: "https://ebook.deali.cn/static/favicon.ico",
	//             desc: "将TXT文本文件转换为EPUB、MOBI、AZW3等电子书格式",
	//         },
	//     ],
	// },
];
