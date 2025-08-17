import { Octokit } from '@octokit/rest';
import { config } from 'dotenv';
config();

// --- CONFIGURATION ---
const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const PORTFOLIO_REPO = process.env.GITHUB_PORTFOLIO_REPO;

if (!GITHUB_PAT || !GITHUB_USERNAME || !PORTFOLIO_REPO) {
    throw new Error("GitHub credentials and repository name are not fully configured on the server.");
}

const octokit = new Octokit({ auth: GITHUB_PAT });
const owner = GITHUB_USERNAME;

/**
 * Ensures the main portfolio repository exists and has GitHub Pages enabled.
 * Creates the repository if it doesn't exist.
 */
const ensurePortfolioRepoExists = async () => {
    try {
        await octokit.repos.get({ owner, repo: PORTFOLIO_REPO });
        console.log(`Main portfolio repository '${PORTFOLIO_REPO}' already exists.`);
    } catch (error) {
        if (error.status === 404) {
            console.log(`Creating main portfolio repository: '${PORTFOLIO_REPO}'`);
            await octokit.repos.createForAuthenticatedUser({
                name: PORTFOLIO_REPO,
                description: 'A collection of AI-generated user portfolios from NxtResume.',
                private: false,
                auto_init: true, // Creates the main branch with a README
            });

            console.log(`Enabling GitHub Pages for '${PORTFOLIO_REPO}'...`);
            await octokit.repos.enablePagesSite({
                owner,
                repo: PORTFOLIO_REPO,
                source: { branch: 'main', path: '/' },
            });
            
            // A short delay for GitHub to process the new repo
            await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
            // Rethrow other critical errors
            console.error("Error ensuring portfolio repo exists:", error);
            throw error;
        }
    }
};

/**
 * Creates or updates a user's portfolio file within the main portfolio repository.
 * @param {object} user - The user object containing fullName and niatId.
 * @param {string} htmlContent - The generated HTML content for the portfolio.
 * @returns {string} The live URL of the user's portfolio.
 */
export const createOrUpdatePortfolio = async (user, htmlContent) => {
    // Ensure the main portfolio repository exists before proceeding
    await ensurePortfolioRepoExists();

    const userFolder = user.niatId.toLowerCase();
    const filePath = `${userFolder}/index.html`;

    let existingFileSha = null;
    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo: PORTFOLIO_REPO,
            path: filePath,
        });
        existingFileSha = data.sha;
        console.log(`Updating existing portfolio for user: ${user.niatId}`);
    } catch (error) {
        if (error.status === 404) {
            console.log(`Creating new portfolio file for user: ${user.niatId}`);
        } else {
            // Log other potential errors with getContent
            console.error(`Error fetching content for ${filePath}:`, error);
        }
    }

    // Create or update the index.html file in the user's subfolder
    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: PORTFOLIO_REPO,
        path: filePath,
        message: `Update portfolio for ${user.fullName} (${user.niatId})`,
        content: Buffer.from(htmlContent).toString('base64'),
        sha: existingFileSha, // Pass null if file is new, or the sha if updating
    });

    console.log(`Successfully created/updated portfolio content for ${user.niatId}.`);

    // The GitHub Pages site is enabled on the repository root.
    // GitHub automatically serves files from subdirectories.
    
    // Return the correctly formatted GitHub Pages URL
    return `https://${owner}.github.io/${PORTFOLIO_REPO}/${userFolder}/`;
};
