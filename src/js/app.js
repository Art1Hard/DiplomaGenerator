import DiplomaGenerator from "./modules/DiplomaGenerator.js";
import startType from "./modules/typeTitle.js";
import { isWebp } from "./modules/webp.js";

const diplomaEl = document.querySelector(".diploma");
const form = document.getElementById("diploma-form");
const downloadPDFBtn = document.getElementById("download-pdf");
const downloadPNGBtn = document.getElementById("download-png");
const loader = document.querySelector(".loading");

isWebp();

const diplomaG = new DiplomaGenerator(diplomaEl, form, {
	loader: loader,
});
diplomaG.downloadDocumentByPDF(downloadPDFBtn);
diplomaG.downloadDocumentByPNG(downloadPNGBtn);
diplomaG.initDiplomaGenerator();

startType();
