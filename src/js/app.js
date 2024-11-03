import {
	downloadDocumentByPdf,
	downloadDocumentByPng,
} from "./modules/download.js";
import { isWebp } from "./modules/webp.js";

const diplomaEl = document
	.querySelector("#diploma-el")
	.querySelector(".diploma__background");
const downloadPDFBtn = document.getElementById("download-pdf");
const downloadPNGBtn = document.getElementById("download-png");

isWebp();
downloadDocumentByPdf(diplomaEl, downloadPDFBtn);
downloadDocumentByPng(diplomaEl, downloadPNGBtn);
