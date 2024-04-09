const times = document.querySelectorAll(".time");
const dates = document.querySelectorAll(".date");

const WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const thisYear = new Date().getFullYear();

const getTwoDigit = num => ("0" + num).slice(-2);

times.forEach(item => {
	const date = new Date(item.textContent);

	const hours = getTwoDigit(new Date(date).getHours());
	const minutes = getTwoDigit(new Date(date).getMinutes());

	item.textContent = `${hours}:${minutes}`;
});

dates.forEach(item => {
	const date = new Date(item.textContent);

	const week = WEEKS[date.getDay()];
	const month = MONTHS[date.getMonth()];
	const day = date.getDate();
	let year = date.getFullYear();
	year = year === thisYear ? "" : `, ${year}`;

	item.textContent = `${week}, ${month} ${day}${year}`;
});
