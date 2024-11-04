import DiplomaGenerator from "./modules/DiplomaGenerator.js";
import { isWebp } from "./modules/webp.js";

const diplomaEl = document.querySelectorAll(".diploma");
const form = document.getElementById("diploma-form");
const downloadPDFBtn = document.getElementById("download-pdf");
const downloadPNGBtn = document.getElementById("download-png");
const loader = document.querySelector(".loading");

isWebp();

const diplomaG = new DiplomaGenerator(diplomaEl[1], diplomaEl[0], form, loader);
diplomaG.downloadDocumentByPDF(downloadPDFBtn);
diplomaG.downloadDocumentByPNG(downloadPNGBtn);
diplomaG.initDiplomaGenerator();
