module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-unused-vars": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"@typescript-eslint/ban-ts-comment": 0,
	},
};
