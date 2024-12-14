export function getBasePath() {
    // Update this with your GitHub repository name
    const repoName = '/next-portfolio';
    return process.env.NODE_ENV === 'production' ? repoName : '';
}
