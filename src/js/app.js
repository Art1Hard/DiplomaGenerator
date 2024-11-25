import DiplomaGenerator from "./modules/DiplomaGenerator.js";
import isWebp from "./modules/webp.js";

const loader = document.querySelector(".loading");
const diplomaG = new DiplomaGenerator(".diploma", "diploma-form", {
	loader: loader,
	inputErrorClass: "diploma-form__input--error",
	sliderClass: ".slider",
});

isWebp();

// initSlider();

// diplomaG.downloadDocument("#download-pdf", true);
diplomaG.downloadDocument("#download-png");

diplomaG.initDiplomaGenerator();

diplomaG.initSlider();
