declare interface Package{
	"name": string,
	"version": string,
	"description": string,
	"main": string,
	"scripts": {
    [scripts: string]: string,
		"start": string,
		"test": string
	},
	"repository": {
		"type": string,
		"url": string
	},
	"keywords": string[],
	"author": string,
	"license": string,
	"bugs": {
		"url": string
	},
	"homepage": string,
	"dependencies": {
		[packages: string]: string
	}
}
