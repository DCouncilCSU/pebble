import Poco from "commodetto/Poco";
import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";

// Create the rendering context
const render = new Poco(screen);

// Helper function to return a font of a desired size
function getFont(name, size) {
	const font = parseBMF(new Resource(`${name}-${size}.fnt`));
	font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`));
	return font;
}

// Define the colors to be used
const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

// Define basic strings for date display
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Create the fonts to be used
const timeFont = getFont("Jersey10-Regular", 56);
const dateFont = getFont("Jersey10-Regular", 24);

// Precompute layout positions for time and date
// Add height of the two fonts
const blockHeight = timeFont.height + dateFont.height;
// Center the two fonts vertically
const timeY = (render.height - blockHeight) / 2;
// Place the date below the time
const dateY = timeY + timeFont.height;


// This is the thing that runs every minute
function draw(event) {
	const now = event.date

	render.begin();

	// Black background
	render.fillRectangle(black, 0, 0, render.width, render.height);

	// Time drawing
	// Format time HH:MM
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const timeString = hours + ":" + minutes;

	// Draw the time
	let width = render.getTextWidth(timeString, timeFont);
	render.drawText(timeString, timeFont, white,
		(render.width - width) / 2, timeY);

	// Date drawing
	const dayName = DAYS[now.getDay()];
	const monthName = MONTHS[now.getMonth()];
	// Format as "Wed Aug 08"
	const dateStr = dayName + " " + monthName + " " + String(now.getDate()).padStart(2, "0");

	// Draw the date centered below time
	width = render.getTextWidth(dateStr, dateFont);
	render.drawText(dateStr, dateFont, white,
		(render.width - width) / 2, dateY);

	render.end();
}

// Each minute, call the draw function
watch.addEventListener('minutechange', draw);
