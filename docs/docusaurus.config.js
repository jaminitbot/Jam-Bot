/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
	plugins: [require.resolve('docusaurus-lunr-search')],
	title: 'Jam-Bot',
	tagline: 'A feature rich discord bot',
	url: 'https://jambot.jaminit.co.uk',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'jamesatjaminit', // Usually your GitHub org/user name.
	projectName: 'jam-bot', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: 'Jam Bot',
			logo: {
				alt: 'Logo',
				src: 'img/JamBotWithoutBackground.png',
			},
			items: [
				{
					to: 'docs/',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left',
				},
				{ 
					to: 'blog', 
					label: 'Blog', 
					position: 'left' 
				},
				{ 
					to: 'status', 
					label: 'Status', 
					position: 'left' 
				},
				{
					href: 'https://github.com/jamesatjaminit/jam-bot',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Links',
					items: [
						{
							label: 'Main Documentation',
							to: 'docs/',
						},
						{
							label: 'Status',
							to: 'status/',
						},
						// {
						//   label: 'Second Doc',
						//   to: 'docs/doc2/',
						// },
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Discord',
							href: 'https://discord.gg/jbJvckFwda',
						},
						{
							label: 'Twitter',
							href: 'https://twitter.com/jamesatjaminit',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Blog',
							to: 'blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/jamesatjaminit/Jam-Bot',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} James Cook`,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl:
						'https://github.com/jamesatjaminit/Jam-Bot/edit/main/docs/',
				},
				blog: {
					showReadingTime: false,
					// Please change this to your repo.
					editUrl:
						'https://github.com/jamesatjaminit/Jam-Bot/edit/main/docs/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
};
