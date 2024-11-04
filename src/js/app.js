import DiplomaGenerator from "./modules/DiplomaGenerator.js";
import { isWebp } from "./modules/webp.js";

const diplomaEl = document.querySelector(".diploma__background");
const downloadPDFBtn = document.getElementById("download-pdf");
const downloadPNGBtn = document.getElementById("download-png");
const loader = document.querySelector(".loading");

isWebp();

const diplomaG = new DiplomaGenerator(diplomaEl, undefined, loader);
diplomaG.downloadDocumentByPDF(downloadPDFBtn);
diplomaG.downloadDocumentByPNG(downloadPNGBtn);
