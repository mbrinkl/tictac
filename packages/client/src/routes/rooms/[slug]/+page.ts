export const load = ({ params: { slug }, url }) => {
	const isPrivate = url.searchParams.get('private') === 'true';
	return { slug, isPrivate };
};
