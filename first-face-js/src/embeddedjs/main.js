import Poco from "commodetto/Poco";
import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";
import Battery from "embedded:sensor/Battery";

// Helper function to return a font of a desired size
function getFont(name, size) {
	const font = parseBMF(new Resource(`${name}-${size}.fnt`));
	font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`));
	return font;
}

function drawBatteryBar() {
	const barWidth = (render.width / 2) | 0;
	const barX = (render.width - barWidth) / 2 | 0;
	const barY = render.height < 180 ? 6 : 20;
	const barHeight = 8

	// Draw border
	render.fillRectangle(white, barX, barY, barWidth, barHeight);
	render.fillRectangle(black, barX + 1, barY + 1, barWidth - 2, barHeight - 2);

	// Choose color based on battery level
	let barColor;
	if (batteryPercent <= 20) {
		barColor = red;
	} else if (batteryPercent <= 40) {
		barColor = yellow;
	} else {
		barColor = green;
	}

	// Draw level
	const levelWidth = ((barWidth - 4) * batteryPercent / 100) | 0;
	render.fillRectangle(barColor, barX + 2, barY + 2, levelWidth, barHeight - 4);
}

// Create the rendering context
const render = new Poco(screen);

// Define basic strings for date display
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
	"Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Define the colors to be used
const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);
const green = render.makeColor(0, 170, 0);
const yellow = render.makeColor(255, 170, 0);
const red = render.makeColor(255, 0, 0);

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

// Battery meter calculations
let batteryPercent = 100;

// Set up battery monitoring
const battery = new Battery({
	onSample() {
		batteryPercent = this.sample().percent;
		drawScreen();
	}
});

// Get initial battery percentage
batteryPercent = battery.sample().percent;

// This is the thing that does all the work
function draw(event) {
	const now = event.date

	render.begin();

	// Black background
	render.fillRectangle(black, 0, 0, render.width, render.height);

	drawBatteryBar();

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
	const dayName = DAYS_ES[now.getDay()];
	const monthName = MONTHS_ES[now.getMonth()];
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
