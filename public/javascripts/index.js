const handleClick = e => {
	const nav = document.querySelector("nav");
	const theme = document.querySelector(".theme");

	const handleCloseAccountList = () => {
		nav.classList.remove("active");
	};

	const handleActiveAccountList = () => {
		nav.classList.toggle("active");
	};

	const handleChangeTheme = () => {
		theme.classList.toggle("active");
		localStorage.setItem(
			"darkScheme",
			JSON.stringify(document.body.classList.toggle("dark"))
		);
	};

	nav.classList.contains("active") &&
		!e.target.closest(".account") &&
		!e.target.closest("nav ul") &&
		handleCloseAccountList();
	e.target.closest(".account") && handleActiveAccountList();
	e.target.closest(".themeToggle") && handleChangeTheme();
};

document.body.addEventListener("click", handleClick);
