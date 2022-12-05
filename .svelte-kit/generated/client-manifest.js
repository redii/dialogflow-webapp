export { matchers } from './client-matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8')];

export const server_loads = [];

export const dictionary = {
	"/": [2],
	"/chatbots/ben_inkl": [4],
	"/chatbots/ben": [3],
	"/chatbots/lena_inkl": [6],
	"/chatbots/lena": [5],
	"/chatbots/maxo": [8],
	"/chatbots/max": [7]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};