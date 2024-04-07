const container = document.querySelector(".container");

const position = JSON.parse(sessionStorage.getItem("scroll-position"));

position && (container.scrollTop = position);

container.addEventListener("scroll", e => {
	sessionStorage.setItem(
		"scroll-position",
		JSON.stringify(e.target.scrollTop)
	);
});
