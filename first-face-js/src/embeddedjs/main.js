import Poco from "commodetto/Poco";

// console.log("Hello, Watchface.");

let render = new Poco(screen);

const timeFont = new render.Font("Bitham-Bold", 42);
const dateFont = new render.Font("Gothic-Bold", 24);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function draw(event) {
	const now = event.date

	render.begin();
	render.fillRectangle(black, 0, 0, render.width, render.height);

	// Time drawing
	// Fort time as HH:MM
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const timeString = hours + ":" + minutes;

	let width = render.getTextWidth(timeString, timeFont);

	render.drawText(timeString, timeFont, white,
		(render.width - width) / 2,
		(render.height / 2) - timeFont.height + 5);

	// Date drawing
	const dayName = DAYS[now.getDay()];
	const monthName = MONTHS[now.getMonth()];
	const dateStr = dayName + " " + monthName + " " + String(now.getDate()).padStart(2, "0");

	width = render.getTextWidth(dateStr, dateFont);
	render.drawText(dateStr, dateFont, white,
		(render.width - width) / 2,
		(render.height / 2) + 10);

	render.end();
}

watch.addEventListener('minutechange', draw);
