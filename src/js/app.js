import DiplomaGenerator from "./modules/DiplomaGenerator.js";
import startType from "./modules/typeTitle.js";
import { isWebp } from "./modules/webp.js";

const loader = document.querySelector(".loading");

isWebp();

const diplomaG = new DiplomaGenerator(".diploma", "diploma-form", {
	loader: loader,
	inputErrorClass: "diploma-form__input--error",
});
diplomaG.downloadDocument("#download-pdf", true);
diplomaG.downloadDocument("#download-png");
diplomaG.initDiplomaGenerator();

startType();
