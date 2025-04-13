export function getBasePath() {
	const repoName = "/next-portfolio";
	return process.env.NODE_ENV === "production" ? repoName : "";
}
