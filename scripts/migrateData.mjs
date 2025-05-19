import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configure dotenv to load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// --- IMPORTANT: USER CONFIGURATION REQUIRED ---
// 1. Replace this with your actual Supabase User ID
const USER_ID = "78e2efe2-19a1-4050-9431-993c071eddae"; // e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

// 2. Copy and paste your data arrays from src/data/*.ts files into the sections below.
//    Ensure the variable names match those used in the migration functions.

// --- BEGIN DATA PASTE SECTION ---

// From src/data/aboutMeData.ts
// const aboutMeText = \`...\`;
// const aboutInfo = { ... };
// const localHobbies = [ ... ]; // Renamed to avoid conflict
// const localSkillset = [ ... ]; // Renamed to avoid conflict
// const localTools = [ ... ]; // Renamed to avoid conflict
// const githubUsername = "...";

// Example (replace with your actual data):
const aboutMeText =
	"Hello! I'm Neddy Avgha Prasetio, a 23-year-old Computer Science student from Cicurug, Indonesia. While I'm passionate about coding and pursuing my Bachelor's degree, I also love diving into other activities!";

// Data from aboutMeData.ts, to be used for new columns
const aboutInfoData = {
	// Renamed from aboutInfo to avoid conflict if user pastes directly
	name: "Neddy Avgha Prasetio",
	location: "Cicurug, Indonesia",
	education: {
		degree: "Bachelor's",
		field: "Computer Science",
	},
	quote: {
		text: "Simple But Better!",
		author: "Neddy Avgha Prasetio",
	},
};

const hobbiesData = [
	// Renamed from hobbies
	{ name: "Music", iconName: "Music" }, // Storing icon name as string
	{ name: "Reading Comic", iconName: "Book" },
	{ name: "Playing Games", iconName: "Gamepad" },
];

const skillsetData = [
	// Renamed from skillset
	{ name: "PHP", iconName: "SiPhp" },
	{ name: "Laravel", iconName: "FaLaravel" },
	{ name: "JavaScript", iconName: "BiLogoJavascript" },
	{ name: "Tailwind CSS", iconName: "RiTailwindCssFill" },
	{ name: "React", iconName: "FaReact" },
	{ name: "Kotlin", iconName: "SiKotlin" },
	{ name: "Git", iconName: "DiGit" },
	{ name: "MySQL", iconName: "SiMysql" },
	{ name: "PostgreSQL", iconName: "SiPostgresql" },
];

const toolsData = [
	// Renamed from tools
	{ name: "VS Code", iconName: "BiLogoVisualStudio" },
	{ name: "Postman", iconName: "SiPostman" },
	{ name: "JetBrains", iconName: "SiJetbrains" },
	{ name: "Windows", iconName: "DiWindows" },
	{ name: "Linux", iconName: "AiOutlineLinux" },
	{ name: "Docker", iconName: "SiDocker" },
	{ name: "GitHub", iconName: "SiGithub" },
];
const githubUsername = "neddyap";

// From src/data/portfolioData.ts
// const projects = [ ... ]; // array of project objects
// Example (replace with your actual data):
const projects = [
	{
		title: "Global Competency",
		description:
			"Company profile website for certification and training company, showcasing services, portfolio, and contact information. Built with Laravel and React JS with MySQL database.",
		image: { src: "/projects/globalcompetency.png" },
		link: "https://globalcompetency.id/",
		technologies: [
			"Laravel",
			"MySQL",
			"PHP",
			"React",
			"Tailwind CSS",
			"Shadcn UI",
		],
	},
	{
		title: "Vehicle Management System",
		description:
			"Web app that is designed to help users manage their vehicles, including adding, updating, and deleting vehicles. Built with Laravel and MySQL.",
		image: { src: "/projects/managementKendaraan.png" },
		link: "https://github.com/neddyap/management-kendaraan",
		technologies: ["Laravel", "MySQL", "PHP", "Bootstrap"],
	},
	{
		title: "RutBis",
		description:
			"Mobile app that is designed to help users find the best route to their destination by providing the shortest route, the fastest route, and the route with the least traffic. Built with Kotlin.",
		image: { src: "/projects/rutbis.png" },
		link: "https://github.com/neddyap/rutbis",
		technologies: ["Kotlin", "Android Studio"],
	},
	{
		title: "Portfolio",
		description:
			"My personal Personal Website showcasing my skills, and projects. Built with Javascripts with React library.",
		image: { src: "/projects/portfolio.png" },
		link: "https://github.com/neddyap/next-portfolio",
		technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
	},
	{
		title: "Code Crafter",
		description:
			"Landing Page for a web development company, showcasing services, portfolio, and contact information. Built with HTML, CSS, and Bootstrap.",
		image: { src: "/projects/codecrafter.png" },
		link: "https://github.com/neddyap/companyprofile",
		technologies: ["HTML", "CSS", "Bootstrap", "JavaScript"],
	},
	{
		title: "Streamlt",
		description:
			"Mobile app designed to stream movies and tv shows, discover new movies and tv shows, and manage your watchlist. Built with Flutter and Firebase.",
		image: { src: "/projects/streamlt.png" },
		link: "https://github.com/neddyap/streamlt",
		technologies: ["Flutter", "Dart", "Firebase", "REST API"],
	},
];

// From src/data/experienceData.ts
const experienceItems = [
	{
		icon: { name: "LuGraduationCap" },
		title: "University Student",
		organization: "Djuanda University",
		period: "2022 - Present",
		description:
			"Currently pursuing a Bachelor's degree in Information Technology at Djuan University.",
	},
	{
		icon: { name: "LuBriefcase" },
		title: "Fullstack Developer - Internship",
		organization: "Dinas Perhubungan Kota Bogor",
		period: "1 Month: 22 July - 22 August 2024",
		description:
			"Engage with internal teams and conduct data cleansing on internal vehicle data to support application development. This effort culminates in the development of a Vehicle Maintenance Management Website, utilizing PHP with the Laravel framework and a MySQL database.",
	},
	{
		icon: { name: "MdWorkOutline" },
		title: "Technical Support",
		organization: "PT. Helios Informatioka Nusantara",
		period: "8 Months: January - August 2021",
		description:
			"Collaborated with internal client teams to create documentation for the pre-activation and post-activation stages of MFA. Provided troubleshooting support for Microsoft 365 accounts in client projects and successfully activated MFA for over 16,000 accounts. The project concluded with the activation and troubleshooting of Microsoft 365 accounts for Bank Mandiri.",
	},
	{
		icon: { name: "LuBriefcase" },
		title: "Junior Programmer - Internship",
		organization: "PT. Nawa Darsana Teknologi",
		period: "6 Months: January - June 2019",
		description:
			"Collaborated with internal teams to create and train ChatBot applications using Kata.AI tools. Participated in ChatBot training for the development of the Jejakin project and developed RestAPI using the Flask framework (Python) for the final project. The project concluded with the successful development of a chatbot for hotel booking.",
	},
];

// From src/data/certificateData.ts
// const certificateData = [ ... ]; // array of certificate objects
// Example (replace with your actual data):
const certificateData = [
	{
		title: "Full Stack Developer",
		description: "Full Stack Developer Certificate",
		date: "2024-07-22",
		link: `/certificates/Magang_Dishub.pdf`,
	},
	{
		title: "Google Data Analytics",
		description: "Google Data Analytics Professional Certificate",
		date: "2024-01-29",
		link: `/certificates/Coursera_GoogleDataAnalytics.pdf`,
	},
	{
		title: "Google IT Support",
		description: "Google IT Support Professional Certificate",
		date: "2023-06-13",
		link: `/certificates/Coursera_ITSupportGoogle.pdf`,
	},
	{
		title: "Programer Intern",
		description: "Programmer Internship Certificate",
		date: "2019-01-21",
		link: `/certificates/Magang_Nawa.pdf`,
	},
];

// --- END DATA PASTE SECTION ---

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key

if (!supabaseUrl || !serviceKey) {
	console.error(
		"Supabase URL or Service Role Key is missing. Check your .env.local file and ensure SUPABASE_SERVICE_ROLE_KEY is set."
	);
	process.exit(1);
}

if (USER_ID === "YOUR_SUPABASE_USER_ID" || !USER_ID) {
	console.error(
		'Error: USER_ID is not set. Please replace "YOUR_SUPABASE_USER_ID" with your actual Supabase user ID in this script.'
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Helper function to extract filename from StaticImageData
function getImageFilename(imageObject) {
	if (typeof imageObject === "string") {
		return path.basename(imageObject);
	}
	if (imageObject && typeof imageObject.src === "string") {
		return path.basename(imageObject.src);
	}
	return null;
}

// Helper function to parse date periods
function parseExperiencePeriod(periodString) {
	if (!periodString || typeof periodString !== "string") {
		return { start_date: null, end_date: null };
	}

	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

	if (periodString.toLowerCase().includes("present")) {
		const parts = periodString.split(/–|-/); // Split by en-dash or hyphen
		const startDateMatch = parts[0]
			? parts[0].trim().match(/(\w+)\s+(\d{4})/)
			: null; // "Month YYYY"
		if (startDateMatch) {
			try {
				const startDate = new Date(
					startDateMatch[1] + " 1, " + startDateMatch[2]
				)
					.toISOString()
					.split("T")[0];
				return { start_date: startDate, end_date: null }; // 'Present' means end_date is null
			} catch (e) {
				console.warn(
					"Could not parse start date from period: " + periodString
				);
				return { start_date: null, end_date: null };
			}
		}
		return { start_date: null, end_date: null }; // Cannot parse start date
	}

	// Attempt to parse "X Month(s): DD Month - DD Month YYYY"
	const specificDurationMatch = periodString.match(
		/(\d+)\s+Month(?:s)?:\s+(\d{1,2})\s+(\w+)\s+-\s+(\d{1,2})\s+(\w+)\s+(\d{4})/i
	);
	if (specificDurationMatch) {
		try {
			const startDay = specificDurationMatch[2];
			const startMonth = specificDurationMatch[3];
			const endDay = specificDurationMatch[4];
			const endMonth = specificDurationMatch[5];
			const year = specificDurationMatch[6];
			const startDate = new Date(
				startMonth + " " + startDay + ", " + year
			)
				.toISOString()
				.split("T")[0];
			const endDate = new Date(endMonth + " " + endDay + ", " + year)
				.toISOString()
				.split("T")[0];
			return { start_date: startDate, end_date: endDate };
		} catch (e) {
			console.warn(
				"Could not parse specific duration date period: " + periodString
			);
		}
	}

	// Attempt to parse "X Months: Month - Month YYYY"
	// Example: "8 Months: January - August 2021"
	let simplifiedPeriodString = periodString;
	const generalDurationMatch = periodString.match(/^\d+\s+Months?:\s*(.*)/i);
	if (generalDurationMatch && generalDurationMatch[1]) {
		simplifiedPeriodString = generalDurationMatch[1]; // "January - August 2021"
	}

	const rangeMatch = simplifiedPeriodString.split(/–|-/);
	if (rangeMatch.length === 2) {
		try {
			let startDateStr = rangeMatch[0].trim(); // "January"
			let endDateStr = rangeMatch[1].trim(); // "August 2021"

			let startYear, endYear;
			const startMatch = startDateStr.match(/(\w+)\s*(\d{4})?/); // [full, month, year?]
			const endMatch = endDateStr.match(/(\w+)\s*(\d{4})?/); // [full, month, year?]

			if (!startMatch || !endMatch) {
				throw new Error(
					"Could not match month and year in range parts"
				);
			}

			const startMonth = startMatch[1];
			const endMonth = endMatch[1];

			endYear = endMatch[2]; // Year from end part, e.g., "2021"
			startYear = startMatch[2] || endYear; // If start part has no year, use end part's year

			if (!startYear || !endYear) {
				throw new Error("Year could not be determined for date range");
			}

			// Construct full date strings for Date parser
			const monthMap = {
				january: 1,
				feb: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12,
				jan: 1,
				feb: 2,
				mar: 3,
				apr: 4,
				jun: 6,
				jul: 7,
				aug: 8,
				sep: 9,
				oct: 10,
				nov: 11,
				dec: 12,
			};

			const startMonthNum = monthMap[startMonth.toLowerCase()];
			const endMonthNum = monthMap[endMonth.toLowerCase()];

			if (!startMonthNum || !endMonthNum) {
				throw new Error("Invalid month name in date range");
			}

			const startDate =
				startYear +
				"-" +
				String(startMonthNum).padStart(2, "0") +
				"-01";

			// Calculate last day of the end month
			const lastDay = new Date(
				parseInt(endYear),
				endMonthNum,
				0
			).getDate();
			const endDate =
				endYear +
				"-" +
				String(endMonthNum).padStart(2, "0") +
				"-" +
				String(lastDay).padStart(2, "0");

			return { start_date: startDate, end_date: endDate };
		} catch (e) {
			console.warn(
				"Could not parse date range period: " +
					periodString +
					"; Error: " +
					e.message
			);
		}
	}

	// Fallback for single date or unparseable
	try {
		const singleDate = new Date(periodString.trim())
			.toISOString()
			.split("T")[0];
		return { start_date: singleDate, end_date: singleDate };
	} catch (e) {
		// If everything fails
		console.warn("Unparseable date period: " + periodString);
		return { start_date: null, end_date: null };
	}
}

// Migration functions
async function migrateAboutMe() {
	console.log("Migrating about_me data...");
	try {
		const dataToInsert = {
			user_id: USER_ID,
			bio: aboutMeText,
			github_url: githubUsername
				? "https://github.com/" + githubUsername
				: null,
			hobbies: hobbiesData.map((h) => ({
				name: h.name,
				icon_name: h.iconName,
			})), // Map to store icon_name
			skillset: skillsetData.map((s) => ({
				name: s.name,
				icon_name: s.iconName,
			})), // Map to store icon_name
			tools: toolsData.map((t) => ({
				name: t.name,
				icon_name: t.iconName,
			})), // Map to store icon_name
			quote: {
				text: aboutInfoData.quote.text,
				author: aboutInfoData.quote.author,
			},
			profile_image_url: "/profile-img.png",
			resume_url: "/Neddy_Avgha_Prasetio.pdf",
			contact_email: "neddy.prasetio@gmail.com",
			linkedin_url: "https://www.linkedin.com/in/neddy-avgha-prasetio/",
		};

		console.log(
			"Data to insert into about_me:",
			JSON.stringify(dataToInsert, null, 2)
		);

		const { data, error } = await supabase
			.from("about_me")
			.upsert(dataToInsert, { onConflict: "user_id" }) // Use upsert
			.select();

		if (error) throw error;
		console.log("about_me data upserted successfully:", data);
	} catch (error) {
		console.error("Error migrating about_me data:", error.message);
	}
}

async function migrateProjects() {
	console.log("Migrating projects data...");
	try {
		const dataToInsert = projects.map((project, index) => {
			const isSourceLink =
				project.link && project.link.includes("github.com");
			return {
				user_id: USER_ID,
				title: project.title,
				description: project.description,
				image_url:
					project.image && project.image.src
						? project.image.src
						: null, // Use the direct src path
				project_link: isSourceLink ? null : project.link,
				source_code_link: isSourceLink ? project.link : null,
				technologies: project.technologies,
				display_order: index + 1, // Add display_order
			};
		});

		console.log(
			"Data to insert/update into projects:",
			JSON.stringify(dataToInsert, null, 2)
		);

		const { data, error } = await supabase
			.from("projects")
			.upsert(dataToInsert, { onConflict: "user_id,title" }) // Upsert with conflict target
			.select();

		if (error) {
			// Check if the error is due to missing unique constraint for onConflict
			if (
				error.message.includes("constraint") &&
				error.message.includes("matching the ON CONFLICT specification")
			) {
				// Made condition more general for constraint issues
				console.warn(
					"Warning: Could not upsert projects due to ON CONFLICT issue. The table 'projects' might be missing a UNIQUE constraint on (user_id, title), or another conflict issue occurred. " +
						"Attempting regular insert. If this fails due to duplicates, please clear the table or add the unique constraint."
				);
				// Fallback to insert
				const { data: insertData, error: insertError } = await supabase
					.from("projects")
					.insert(dataToInsert)
					.select();

				if (insertError) {
					// Handle potential duplicate errors on insert more gracefully
					if (insertError.code === "23505") {
						// PostgreSQL unique violation for insert
						console.warn(
							"Warning: Fallback insert for projects failed due to existing duplicates. " +
								"Please clear the 'projects' table for this user or ensure a UNIQUE constraint on (user_id, title) exists for upsert to work."
						);
						console.log(
							"Projects data migration: 0 records migrated due to duplicates on fallback insert."
						);
					} else {
						console.error(
							"Error during fallback insert for projects data:",
							insertError.message
						);
						throw insertError; // Re-throw other insert errors
					}
				} else {
					console.log(
						"Projects data migrated via insert (fallback):",
						insertData ? insertData.length : 0,
						"records"
					);
				}
			} else {
				// For other errors not related to ON CONFLICT specification
				console.error(
					"Error migrating projects data (upsert attempt):",
					error.message
				);
				throw error;
			}
		} else {
			console.log(
				"Projects data upserted successfully:",
				data ? data.length : 0,
				"records"
			);
		}
	} catch (error) {
		// Catch errors re-thrown from inside the try block or other unexpected errors
		if (
			!error.message.includes("matching the ON CONFLICT specification") &&
			error.code !== "23505"
		) {
			console.error("Unhandled error in migrateProjects:", error.message);
		}
		// Avoid re-throwing if it's a known, handled issue like duplicates or constraint problems already logged.
	}
}

async function migrateExperiences() {
	console.log("Migrating experiences data...");
	try {
		const dataToInsert = experienceItems.map((item) => {
			const { start_date, end_date } = parseExperiencePeriod(item.period);
			return {
				user_id: USER_ID,
				job_title: item.title,
				company_name: item.organization,
				description: item.description,
				start_date: start_date,
				end_date: end_date,
				icon_name: item.icon && item.icon.name ? item.icon.name : null, // Add icon_name
				// company_logo_url and location are in Supabase schema but not in source data
			};
		});

		console.log(
			"Data to insert into experiences:",
			JSON.stringify(dataToInsert, null, 2)
		);

		// Since we are adding a new column and potentially re-running,
		// it's safer to upsert experiences as well, based on a unique combination if possible,
		// or clear the table before running if IDs are not stable.
		// For now, assuming IDs are generated by Supabase and we want to update existing based on title/org if we had a stable key.
		// Simplest for now is to clear and re-insert if this script is run multiple times for experiences.
		// However, to update existing records with the new icon_name, we'd ideally match on existing IDs.
		// Let's try to upsert. We need a conflict target. If 'id' is client-generated and stable, use it.
		// If 'id' is auto-generated by DB, we can't upsert based on it for new items.
		// Let's assume for now we are re-populating and might have old data.
		// A true "update existing records" would be a separate script or more complex logic here.

		// For simplicity in this script, if you run it multiple times,
		// it will try to insert, which will fail if records exist.
		// To update existing records with icon_name, you'd typically do an UPDATE query.
		// Or, if re-populating is acceptable, delete existing records for this user first.

		// Let's change migrateExperiences to upsert based on a composite key if possible, or just insert.
		// Supabase upsert needs a conflict target. If we don't have a unique user-defined key other than 'id' (which is db-generated),
		// we can't easily upsert new items and update old ones in one go without knowing their existing 'id's.

		// Given the current structure, we will stick to insert. If it fails due to duplicates,
		// you would need to manually clear the 'experiences' table for this user before re-running,
		// or we modify this to fetch existing, then update.
		// For now, let's just add the icon_name to the insert.

		const { data, error } = await supabase
			.from("experiences")
			.insert(dataToInsert) // Sticking to insert, ensure table is clear if re-running for experiences
			.select();

		if (error) {
			// Check if the error is due to duplicate key, which is expected if re-running without clearing
			if (error.code === "23505") {
				// PostgreSQL unique violation
				console.warn(
					"Warning: Experiences data likely already exists. If you intended to update, clear the table first or implement an update strategy."
				);
				// To update existing records, you would typically do:
				// for (const item of dataToInsert) {
				//   await supabase.from('experiences').update({ icon_name: item.icon_name }).eq('user_id', USER_ID).eq('job_title', item.job_title).eq('company_name', item.company_name);
				// }
				// This assumes job_title and company_name form a unique enough key for your user's experiences.
			} else {
				throw error;
			}
		}
		if (data) {
			console.log(
				"Experiences data migration attempt completed. Records processed/inserted:",
				data.length
			);
		} else if (!error) {
			console.log(
				"Experiences data migration: No data returned, but no error. This might happen if all records already existed and insert was skipped due to RLS or other reasons not causing a hard error."
			);
		}
	} catch (error) {
		console.error("Error migrating experiences data:", error.message);
	}
}

async function migrateCertificates() {
	console.log("Migrating certificates data...");
	try {
		const dataToInsert = certificateData.map((cert) => ({
			user_id: USER_ID,
			title: cert.title,
			issuing_organization: cert.description, // Mapping original 'description' to 'issuing_organization'
			issue_date: cert.date
				? new Date(cert.date).toISOString().split("T")[0]
				: null,
			certificate_image_url: cert.link, // Corrected: cert.link is the image/pdf path
			credential_url: null, // Explicitly set to null as not available
			// credential_id and display_order will be default/null
		}));

		console.log(
			"Data to insert into certificates:",
			JSON.stringify(dataToInsert, null, 2)
		);

		const { data, error } = await supabase
			.from("certificates")
			.insert(dataToInsert)
			.select();

		if (error) throw error;
		console.log(
			"Certificates data migrated successfully:",
			data.length,
			"records"
		);
	} catch (error) {
		console.error("Error migrating certificates data:", error.message);
	}
}

// Main migration function
async function main() {
	console.log("Starting data migration to Supabase...");

	if (!USER_ID || USER_ID === "YOUR_SUPABASE_USER_ID") {
		console.error(
			"Please set your Supabase User ID in the USER_ID variable at the top of the script."
		);
		return;
	}
	if (
		typeof aboutMeText === "undefined" ||
		typeof projects === "undefined" ||
		typeof experienceItems === "undefined" ||
		typeof certificateData === "undefined"
	) {
		console.error(
			"One or more data arrays are undefined. Please ensure you have copied your data into the script."
		);
		return;
	}

	await migrateAboutMe();
	await migrateProjects();
	await migrateExperiences();
	await migrateCertificates();

	console.log("Data migration process completed.");
}

main().catch(console.error);
